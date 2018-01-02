package com.jade.mystock;

import android.content.Context;
import android.content.SharedPreferences;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.content.pm.Signature;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.net.Uri;
import android.os.Bundle;
import android.preference.PreferenceManager;
import android.support.annotation.NonNull;
import android.support.annotation.Nullable;
import android.support.v4.app.Fragment;
import android.util.Base64;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.webkit.JavascriptInterface;
import android.webkit.ValueCallback;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.ImageButton;
import android.widget.ImageView;
import android.widget.ListView;
import android.widget.ProgressBar;
import android.widget.Spinner;
import android.widget.TextView;
import android.widget.Toast;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;

import com.facebook.FacebookSdk;
import com.facebook.share.model.ShareLinkContent;
import com.facebook.share.widget.ShareDialog;

import static android.content.Context.MODE_PRIVATE;
import static com.facebook.FacebookSdk.getApplicationContext;

/**
 * Created by logicRabbit on 11/19/17.
 */

public class CurrentTab extends Fragment  {

    //Test Basic Info Mock Data

    final String LOG_TAG = "TAB1";

    public String symbol;
    private View rootView;
    private ListView basicInfoListView;
    private ProgressBar basicInfoProgressBar;
    private TextView basicInfoErrorTextView;
    private final String[] mlistItem = new String[]{"Stock Symbol","Last Price", "Change", "Timestamp", "Open", "Close", "Days'Range", "Volume"};
    private String[] currentBasicInfo;
    private BasicInfoArrayAdapter madapter;
    private int status = 0;
    private boolean isFav = false;

    //Fav Button
    private ImageButton favoriteButton;

    //SharedPreference
    private SharedPreferences mPrefs;
    private SharedPreferences.Editor mEditor;
    private String favCandidate;

    //Facebook Button
    private ImageButton facebookButton;

    //Indicators
    private final String[] INDICATORS = {"SMA", "EMA", "STOCH", "RSI", "ADX", "CCI", "BBANDS", "MACD"};
    private HashMap<String, Indicators> indicatorsHashMap = new HashMap<String, Indicators>();
    private Spinner indicatorsSpinner;
    private String currentIdx = "Price";
    private Button changeButton;
    private WebView indicatorWebView;
    private ShareDialog shareDialog;
    private ProgressBar indicatorProgressBar;
    private TextView indicatorErrorText;
    private int indStatus = -1;
    private boolean canChange = true;
    private String lastChange = "";

    //id
    private static int id = 0;


    private class Indicators {
        private JSONObject obj;
        private String idx;
        private int status;
        private String url = "";
        public Indicators() {
            obj = null;
            symbol = null;
            idx = null;
            status = 0;
        }
        public Indicators(JSONObject obj, String idx) throws JSONException {
            this.obj = obj;
            this.idx = idx;
            if (obj != null) {
                String status = obj.getString("status");
                if (status.equals("success")) this.status = 1;
                else this.status = 2;
            }
            else {
                this.status = 0;
            }
        }
        public int getStatus() {
            return status;
        }
        public String getUrl() {
            return url;
        }
        @JavascriptInterface
        public void setUrl(String url) {
            this.url = url;
        }
        @JavascriptInterface
        public String getIdx() {
            return idx;
        }
        @JavascriptInterface
        public String getResult() throws JSONException {
            return obj.toString();
        }
    }

    private class BasicInfoArrayAdapter extends ArrayAdapter<String>{

        private final Context context;
        private final String[] values;

        public BasicInfoArrayAdapter(Context context, String[] values) {
            super(context, R.layout.basic_info, values);
            this.context = context;
            this.values = values;
        }

        @Override
        public View getView(int position, View convertView, ViewGroup parent) {
            LayoutInflater inflater = (LayoutInflater) context
                    .getSystemService(Context.LAYOUT_INFLATER_SERVICE);

            View rowView = inflater.inflate(R.layout.basic_info, parent, false);

            TextView labelTextView = (TextView) rowView.findViewById(R.id.labelTextView);
            TextView contentTextView = (TextView) rowView.findViewById(R.id.contentTextView);

            ImageView upImageView = (ImageView) rowView.findViewById(R.id.upImageView);
            ImageView downImageView = (ImageView) rowView.findViewById(R.id.downImageView);

            upImageView.setVisibility(View.GONE);
            downImageView.setVisibility(View.GONE);

            labelTextView.setText(mlistItem[position]);
            contentTextView.setText(values[position]);

            String s = mlistItem[position];
            if (s.equals("Change")) {
                if (values[position].charAt(0) == '-') {
                    downImageView.setVisibility(View.VISIBLE);
                }
                else {
                    upImageView.setVisibility(View.VISIBLE);
                }
            }
            return rowView;
        }
    }

    @Override
    public void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        for (int i = 0; i < INDICATORS.length; ++i) {
            indicatorsHashMap.put(INDICATORS[i], new Indicators());
        }
        indicatorsHashMap.put("Price", new Indicators());
        Log.d(LOG_TAG, "!! on create");
        shareDialog = new ShareDialog(this);
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {

        Log.d(LOG_TAG, "!! onCreateView " + status);

        setRetainInstance(true);
        rootView = inflater.inflate(R.layout.current_tab, container, false);

        /*Tab1 Current Tab*/

        //Fav Button
        favoriteButton = (ImageButton) rootView.findViewById(R.id.favoriteButton);

        //Facebook Button
        facebookButton = (ImageButton) rootView.findViewById(R.id.facebookButton);

        //Basic Info List
        basicInfoListView = (ListView) rootView.findViewById(R.id.basicInfoListView);
        //Progress Bar
        basicInfoProgressBar = (ProgressBar) rootView.findViewById(R.id.basicInfoProgressBar);
        //Error Info
        basicInfoErrorTextView = (TextView) rootView.findViewById(R.id.basicInfoErrorText);

        //Indicators Info
        indicatorWebView = (WebView) rootView.findViewById(R.id.indicatorWebView);
        WebSettings webSettings = indicatorWebView.getSettings();
        webSettings.setJavaScriptEnabled(true);

        //Change Button
        changeButton = (Button) rootView.findViewById(R.id.changeButton);

        indicatorProgressBar = (ProgressBar) rootView.findViewById(R.id.indicatorProgressBar);
        indicatorErrorText = (TextView) rootView.findViewById(R.id.indicatorErrorText);

        indicatorsSpinner = (Spinner) rootView.findViewById(R.id.indicatorsSpinner);
        indicatorsSpinner.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener() {
            public void onItemSelected(AdapterView<?> parent, View view, int position, long id) {
                String item = parent.getItemAtPosition(position).toString();
                currentIdx = item;
                Log.d("COMPARE", lastChange + "  " + currentIdx);
                if (lastChange.equals(currentIdx)) {
                    changeButton.setEnabled(false);
                }
                else {
                    changeButton.setEnabled(true);
                }
            }
            public void onNothingSelected(AdapterView<?> parent) {
            }
        });

        changeButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Log.d("ONCLICK " , currentIdx);
                if (indicatorsHashMap.containsKey(currentIdx)) {
                    Log.d("ChangeIdx ", "" + indicatorsHashMap.get(currentIdx).getStatus());
                    indStatus = indicatorsHashMap.get(currentIdx).getStatus();
                    lastChange = currentIdx;
                    changeButton.setEnabled(false);
                    setIndicatorView();
                }
            }
        });

        setBasicInfo();
        setFavStatus();
        setIndicatorView();

        favoriteButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                if (favCandidate != null) {
                    Log.d("FAVCLICK", favCandidate);
                    if (!isFav) {
                        mEditor.putString(symbol.toUpperCase(), favCandidate);
                    }
                    else {
                        mEditor.remove(symbol.toUpperCase());
                    }
                    mEditor.commit();
                    setFavStatus();
                }
            }
        });

        facebookButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                if (indicatorWebView != null) {
                    String url = indicatorsHashMap.get(currentIdx).getUrl();
                    if (!url.equals("")) {
                        ShareLinkContent content = new ShareLinkContent.Builder()
                                .setContentUrl(Uri.parse(url))
                                .build();
                        shareDialog.show(content);
                    }
                    else {
                        Context context = getApplicationContext();
                        CharSequence text = "No data yet, you can't post to Facebook";
                        int duration = Toast.LENGTH_SHORT;
                        Toast toast = Toast.makeText(context, text, duration);
                        toast.show();
                    }
                }
            }
        });


        return rootView;
    }

    private void setFavStatus() {
        mPrefs = getActivity().getApplicationContext().getSharedPreferences("FAV", MODE_PRIVATE);
        mEditor = mPrefs.edit();
        if (symbol != null && mPrefs.contains(symbol)) {
            isFav = true;
            favoriteButton.setBackgroundResource(R.drawable.filled);
        }
        else {
            isFav = false;
            favoriteButton.setBackgroundResource(R.drawable.empty);
        }
    }

    // 0 is fetching, 1 is ready, 2 is error
    private void setStatus(int status) {
        this.status = status;
        setBasicInfo();
    }

    private void setIndicatorView() {
        if (rootView != null) {
            switch (indStatus) {
                case 0:
                    indicatorWebView.setVisibility(View.GONE);
                    indicatorProgressBar.setVisibility(View.VISIBLE);
                    indicatorErrorText.setVisibility(View.GONE);
                    break;
                case 1:
                    indicatorWebView.addJavascriptInterface((Indicators)indicatorsHashMap.get(currentIdx), "indicatorInfo");
                    if (currentIdx.equals("Price")) {
                        indicatorWebView.loadUrl("file:///android_asset/priceChart.html");
                    }
                    else {
                        indicatorWebView.loadUrl("file:///android_asset/indicatorChart.html");
                    }
                    indicatorWebView.setVisibility(View.VISIBLE);
                    indicatorProgressBar.setVisibility(View.GONE);
                    indicatorErrorText.setVisibility(View.GONE);
                    break;
                case 2:
                    indicatorWebView.setVisibility(View.GONE);
                    indicatorProgressBar.setVisibility(View.GONE);
                    indicatorErrorText.setVisibility(View.VISIBLE);
                    break;
                default:
                    indicatorWebView.setVisibility(View.GONE);
                    indicatorProgressBar.setVisibility(View.GONE);
                    indicatorErrorText.setVisibility(View.GONE);
                    break;
            }
        }
    }

    private void setBasicInfo() {
        if (rootView != null) {
            switch (status) {
                case 0:
                    favoriteButton.setEnabled(false);
                    basicInfoProgressBar.setVisibility(View.VISIBLE);
                    basicInfoListView.setVisibility(View.GONE);
                    basicInfoErrorTextView.setVisibility(View.GONE);
                    break;
                case 1:
                    favoriteButton.setEnabled(true);
                    madapter = new BasicInfoArrayAdapter(rootView.getContext(), currentBasicInfo);
                    basicInfoListView.setAdapter(madapter);
                    basicInfoProgressBar.setVisibility(View.GONE);
                    basicInfoListView.setVisibility(View.VISIBLE);
                    basicInfoErrorTextView.setVisibility(View.GONE);
                    break;
                case 2:
                    favoriteButton.setEnabled(false);
                    basicInfoProgressBar.setVisibility(View.GONE);
                    basicInfoListView.setVisibility(View.GONE);
                    basicInfoErrorTextView.setVisibility(View.VISIBLE);
                    break;
                default:
                    break;
            }
        }
        setFavStatus();
    }

    public void setBasicInfo(JSONObject basicInfo) throws JSONException {
        if (basicInfo.getString("status").equals("success")) {
            JSONObject basicInfoJSON = basicInfo.getJSONObject("favData");
            basicInfoJSON.put("id", ++id);
            favCandidate = basicInfoJSON.toString();
            Log.d("DEFAULT", favCandidate);
            symbol = basicInfo.getString("symbol");
            currentBasicInfo = new String[]{
                    basicInfo.getString("symbol"),
                    basicInfo.getString("close"),
                    basicInfo.getString("changeValue") + "(" + basicInfo.getString("changePercent") + ")",
                    basicInfo.getString("timeStamp"),
                    basicInfo.getString("open"),
                    basicInfo.getString("last_close"),
                    basicInfo.getString("dayRange"),
                    basicInfo.getString("volume")
            };
            setStatus(1);
        }
        else {
            setStatus(2);
        }
    }

    public void setIndicatorsHashMap(JSONObject indicatorInfo, int idx) throws JSONException {
        indicatorsHashMap.put(INDICATORS[idx], new Indicators(indicatorInfo, INDICATORS[idx]));
    }

    public void setPriceInfo(JSONObject priceInfo) throws JSONException{
        indicatorsHashMap.put("Price", new Indicators(priceInfo, "Price"));
    }

    @Override
    public void onStart() {
        super.onStart();
        Log.d(LOG_TAG, "------- on start " + indStatus);
    }

    @Override
    public void onPause() {
        super.onPause();
        Log.d(LOG_TAG, "------- on pause");

    }

    @Override
    public void onStop() {
        super.onStop();
        Log.d(LOG_TAG, "------- on stop");

    }

    @Override
    public void onResume() {
        super.onResume();
//        setIndicatorView();
        Log.d(LOG_TAG, "------- on resume " + indStatus);
    }
}

