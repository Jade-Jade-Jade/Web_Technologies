package com.jade.mystock;

import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.graphics.Color;
import android.net.Uri;
import android.os.Handler;
import android.preference.PreferenceManager;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.text.Editable;
import android.text.TextWatcher;
import android.util.Log;
import android.view.ContextMenu;
import android.view.KeyEvent;
import android.view.LayoutInflater;
import android.view.Menu;
import android.view.MenuInflater;
import android.view.MenuItem;
import android.view.View;
import android.view.ViewGroup;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.AutoCompleteTextView;
import android.widget.Button;
import android.widget.CompoundButton;
import android.widget.Filter;
import android.widget.Filterable;
import android.widget.ImageButton;
import android.widget.ListView;
import android.widget.ProgressBar;
import android.widget.Spinner;
import android.widget.Switch;
import android.widget.TextView;
import android.widget.Toast;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.text.DecimalFormat;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

public class StockController extends AppCompatActivity {

    final String LOGCAT_TAG = "FAV";

    private AutoCompleteTextView symbolView;
    // Constants:
    final String AUTOCOMPLETE_URL = "http://angular-express-env.quiexmfkcc.us-west-2.elasticbeanstalk.com/guessSymbolApi";
    private final String BASICINFOAPI = "getBasicInfo";
    private SharedPreferences mPrefs;
    private SharedPreferences.Editor mEditor;

    private ProgressBar autoCompleteProgressBar;
    ArrayList<JSONObject> favArr;
    ArrayList<JSONObject> updateArr;
    private FavListArrayAdapter favAdapter;
    private ListView favListView;
    private Spinner sortKeySpinner;
    private Spinner sortMethodSpinner;
    private String sortKey = "Sort by";
    private final String NOTSORTKEY = "Sort by";
    private String sortMethod = "Order";
    private final String NOTSORTMETHOD = "Order";

    private ImageButton refreshButton;
    private Switch autoRefreshSwitch;
    private ProgressBar favProgressBar;
    private final Handler favHandler = new Handler();
    private Runnable timedTask;

    //Sort
    private final ArrayList<String> SORTKEY = new ArrayList<String>() {{
        add("Sort by");
        add("Default");
        add("Symbol");
        add("Price");
        add("Change");
        add("Change (%)");
    }};

    private final ArrayList<String> SORTMETHOD = new ArrayList<String>(){{
        add("Order");
        add("Ascending");
        add("Descending");
    }};


    private class FavComparator implements Comparator<JSONObject> {
        private String key;
        private String method;
        public FavComparator(String key, String method) {
            switch (key) {
                case "Symbol":
                    this.key = "symbol";
                    break;
                case "Price":
                    this.key = "close";
                    break;
                case "Change":
                    this.key = "changeValue";
                    break;
                case "Change (%)":
                    this.key = "changePercent";
                    break;
                default:
                    this.key = "id";
            }
            this.method = method;
        }
        @Override
        public int compare(JSONObject o1, JSONObject o2) {
            int res = 0;
            if (key.equals("symbol")) {
                String s1 = null;
                String s2 = null;
                try {
                    s1 =  o1.getString(key);
                    s2 = o2.getString(key);
                } catch (JSONException e) {
                    e.printStackTrace();
                }
                res = s1.compareTo(s2);
            }
            else {
                Double d1 = null;
                Double d2 = null;
                try {
                    d1 =  o1.getDouble(key);
                    d2 = o2.getDouble(key);
                } catch (JSONException e) {
                    e.printStackTrace();
                }
                res = d1.compareTo(d2);
            }
            return method.equals("Descending")? (-1 * res) : res;
        }
    }

    private class FavOnClickListener implements View.OnClickListener
    {
        String symbol;
        public FavOnClickListener(String symbol) {
            this.symbol = symbol;
        }
        @Override
        public void onClick(View v)
        {
            NetworkManager.getInstance().cancelAll();
            Intent myIntent = new Intent(StockController.this, InformationController.class);
            myIntent.putExtra("Symbol", symbol);
            startActivity(myIntent);
        }
    };

    private class mArrayAdapter extends ArrayAdapter<String> implements Filterable {
        private ArrayList<String> resultList;
        public mArrayAdapter(Context context, int textViewResourceId, ArrayList<String> values) {
            super(context, textViewResourceId);
            Log.d("mArrayAdapter", "" + values.toString());
            resultList = values;
        }
        @Override
        public int getCount() {
            return resultList.size();
        }
        @Override
        public String getItem(int index) {
            return resultList.get(index);
        }
        @Override
        public Filter getFilter() {
            Filter filter = new Filter() {
                @Override
                protected FilterResults performFiltering(CharSequence charSequence) {
                    FilterResults filterResults = new FilterResults();
                    filterResults.values = resultList;
                    filterResults.count = resultList.size();
                    return filterResults;
                }

                @Override
                protected void publishResults(CharSequence charSequence, FilterResults filterResults) {
                    if (filterResults != null && filterResults.count > 0) {
                        notifyDataSetChanged();
                    }
                    else {
                        notifyDataSetInvalidated();
                    }
                }
            };
            return filter;
        }
    }

    private class FavListArrayAdapter extends ArrayAdapter<JSONObject> {

        private final Context context;
        private final ArrayList<JSONObject> values;

        public FavListArrayAdapter(Context context, ArrayList<JSONObject> values) {
            super(context, R.layout.fav_list, values);
            this.context = context;
            this.values = values;
        }

        @Override
        public View getView(final int position, View convertView, ViewGroup parent) {
            LayoutInflater inflater = (LayoutInflater) context
                    .getSystemService(Context.LAYOUT_INFLATER_SERVICE);

            View rowView = inflater.inflate(R.layout.fav_list, parent, false);

            TextView nameTextView = (TextView) rowView.findViewById(R.id.nameTextView);
            TextView priceTextView = (TextView) rowView.findViewById(R.id.priceTextView);
            TextView changeTextView = (TextView) rowView.findViewById(R.id.changeTextView);

            String symbol = "";

            try {
                JSONObject obj = values.get(position);
                symbol = obj.getString("symbol");
                nameTextView.setText(symbol);
                DecimalFormat df = new DecimalFormat("#.00");
                double closeData = obj.getDouble("close");
                priceTextView.setText(df.format(closeData));
                changeTextView.setText(obj.getString("changeString"));
                if (obj.getString("changeString").charAt(0) == '-') {
                    changeTextView.setTextColor(Color.parseColor("#FF0000"));
                }
                else {
                    changeTextView.setTextColor(Color.parseColor("#00FF00"));
                }

            } catch (JSONException e) {
                e.printStackTrace();
            }

            rowView.setOnClickListener(new FavOnClickListener(symbol));
            rowView.setLongClickable(true);

            return rowView;
        }


    }

    private class SpinnerAdapter extends ArrayAdapter<String> {
        public SpinnerAdapter(Context context, int textViewResourceId, ArrayList<String> values) {
            super(context, textViewResourceId, values);
        }
        private int mPosition = -1;
        public void setPosition(int position) {
            mPosition = position;
        }

        @Override
        public boolean isEnabled(int position) {
            if (position == 0 || position == mPosition) {
                return false;
            }
            return true;
        }

        // Change color item
        @Override
        public View getDropDownView(int position, View convertView,
                                    ViewGroup parent) {
            View mView = super.getDropDownView(position, convertView, parent);
            TextView mTextView = (TextView) mView;
            if (position == 0 || position == mPosition) {
                mTextView.setTextColor(Color.GRAY);
            } else {
                mTextView.setTextColor(Color.BLACK);
            }
            return mView;
        }
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.stock_controller);

        NetworkManager.getInstance(this);

        // Auto complete
        symbolView = (AutoCompleteTextView) findViewById(R.id.autocomplete_symbol);

        // Auto progress bar
        autoCompleteProgressBar = (ProgressBar) findViewById(R.id.autoCompleteProgressBar);
        autoCompleteProgressBar.setVisibility(View.GONE);


        symbolView.addTextChangedListener(new TextWatcher() {
            boolean mToggle = false;
            String lastInput = "";
            String currentInput = "";
            @Override
            public void beforeTextChanged(CharSequence charSequence, int i, int i1, int i2) {}
            @Override
            public void onTextChanged(CharSequence charSequence, int i, int i1, int i2) {
                currentInput = charSequence.toString().trim();
                if (!currentInput.equals(lastInput)) {
                    lastInput = currentInput;
                    Log.d("AUTO", charSequence.toString());
                    autoCompleteProgressBar.setVisibility(View.VISIBLE);
                    NetworkManager.getInstance().getAutoList(currentInput, new InformationListener<JSONArray>() {
                        @Override
                        public void getResult(JSONArray object) {
                            Log.d("KEY", object.toString());
                            try {
                                setAutoList(object);
                            } catch (JSONException e) {
                                e.printStackTrace();
                                autoCompleteProgressBar.setVisibility(View.GONE);
                            }
                        }
                    });
                }
            }
            @Override
            public void afterTextChanged(Editable editable) {
            }
        });

        // Get Quote
        TextView getQuoteButton = (TextView) findViewById(R.id.getQuote);
        getQuoteButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Intent myIntent = new Intent(StockController.this, InformationController.class);
                String symbol = symbolView.getText().toString();
//                Log.d(LOGCAT_TAG, "symbol is " + symbol);

                //Symbol validation
                if (symbol.trim().isEmpty()) {
                    Context context = getApplicationContext();
                    CharSequence text = "Please enter a stock name or symbol";
                    int duration = Toast.LENGTH_SHORT;
                    Toast toast = Toast.makeText(context, text, duration);
                    toast.show();
                }
                else {
                    int iend = symbol.indexOf("-");
                    if (iend != -1) {
                        symbol= symbol.substring(0 , iend).trim();
                    }
                    myIntent.putExtra("Symbol", symbol);
                    NetworkManager.getInstance().cancelAll();
                    startActivity(myIntent);
                }
            }
        });

        // Clear Button
        TextView clearButton = (TextView) findViewById(R.id.clear);
        clearButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
//                finish();
//                startActivity(getIntent());
                NetworkManager.getInstance().cancelAll();
                if (symbolView != null) {
                    symbolView.setText("");
                }
                if (autoCompleteProgressBar != null) {
                    autoCompleteProgressBar.setVisibility(View.GONE);
                }
                if (favProgressBar != null) {
                    favProgressBar.setVisibility(View.GONE);
                }

            }
        });



        // Favorite List
        favListView = (ListView) findViewById(R.id.favListView);
        mPrefs = getApplicationContext().getSharedPreferences("FAV", MODE_PRIVATE);
        mEditor = mPrefs.edit();


        // Fav Spinners
        sortKeySpinner = (Spinner) findViewById(R.id.sortKeySpinner);
        sortMethodSpinner = (Spinner) findViewById(R.id.sortMethodSpinner);
        final SpinnerAdapter sortKeyAdapter = new SpinnerAdapter(this, android.R.layout.simple_list_item_1, SORTKEY);
        final SpinnerAdapter sortMethodAdapter = new SpinnerAdapter(this, android.R.layout.simple_list_item_1, SORTMETHOD);

        sortKeySpinner.setAdapter(sortKeyAdapter);
        sortKeySpinner.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener() {
            public void onItemSelected(AdapterView<?> parent, View view, int position, long id) {
                sortKeyAdapter.setPosition(position);
                String item = parent.getItemAtPosition(position).toString();
                sortKey = item;
                if (favArr != null && !sortKey.equals(NOTSORTKEY) && !sortMethod.equals(NOTSORTMETHOD)) {
                    Collections.sort(favArr, new FavComparator(sortKey, sortMethod));
                    setFavListView();
                }
            }
            public void onNothingSelected(AdapterView<?> parent) {
            }
        });

        sortMethodSpinner.setAdapter(sortMethodAdapter);
        sortMethodSpinner.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener() {
            public void onItemSelected(AdapterView<?> parent, View view, int position, long id) {
                sortMethodAdapter.setPosition(position);
                String item = parent.getItemAtPosition(position).toString();
                sortMethod = item;
                if (favArr != null && !sortKey.equals(NOTSORTKEY) && !sortMethod.equals(NOTSORTMETHOD)) {
                    Collections.sort(favArr, new FavComparator(sortKey, sortMethod));
                    setFavListView();
                }
            }
            public void onNothingSelected(AdapterView<?> parent) {
            }
        });


        // Refresh
        refreshButton = (ImageButton) findViewById(R.id.refreshButton);
        autoRefreshSwitch = (Switch) findViewById(R.id.autoRefreshSwitch);
        favProgressBar = (ProgressBar) findViewById(R.id.favProgressBar);
        favProgressBar.setVisibility(View.GONE);

        refreshButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                try {
                    refreshFavList();
                } catch (JSONException e) {
                    e.printStackTrace();
                }
            }
        });

        timedTask = new Runnable(){
            @Override
            public void run() {
                Log.d("AUTOREFRESH", "hahahahhahah");
                try {
                    refreshFavList();
                } catch (JSONException e) {
                    e.printStackTrace();
                }
                favHandler.postDelayed(timedTask, 5000);
            }
        };

        autoRefreshSwitch.setOnCheckedChangeListener(new CompoundButton.OnCheckedChangeListener() {
            @Override
            public void onCheckedChanged(CompoundButton compoundButton, boolean b) {
                if (b) {
                    Log.d("AUTOREFRESH", "true");
                    favHandler.post(timedTask);
                }
                else {
                    Log.d("AUTOREFRESH", "false");
                    favHandler.removeCallbacksAndMessages(null);
                }
            }
        });

    }
    @Override

    public void onCreateContextMenu(ContextMenu menu, View v,
                                    ContextMenu.ContextMenuInfo menuInfo) {

        MenuInflater inflater = getMenuInflater();

        if (favArr != null && favArr.size() != 0) {
            if (v.getId()==R.id.favListView) {
                AdapterView.AdapterContextMenuInfo info = (AdapterView.AdapterContextMenuInfo)menuInfo;
                try {
//                menu.setHeaderTitle(favArr.get(info.position).getString("symbol"));
                    String thisSymbol = favArr.get(info.position).getString("symbol");
                    menu.setHeaderTitle("Remove from Favorites");
                    String[] menuItems = {"No", "Yes"};
                    for (int i = 0; i<menuItems.length; i++) {
                        menu.add(Menu.NONE, i, i, menuItems[i]);
                    }
                } catch (JSONException e) {
                    e.printStackTrace();
                }
            }
        }
    }

    @Override
    public boolean onContextItemSelected(MenuItem item) {
        AdapterView.AdapterContextMenuInfo info = (AdapterView.AdapterContextMenuInfo)item.getMenuInfo();
        int menuItemIndex = item.getItemId();
        String listItemName = null;
        try {
            listItemName = favArr.get(info.position).getString("symbol");
            Log.d("CONTEXTMENU", menuItemIndex + " " + listItemName);
            if (menuItemIndex == 1) {
                mEditor.remove(listItemName);
                mEditor.commit();
                fetchFavList();
                Collections.sort(favArr, new FavComparator(sortKey, sortMethod));
                setFavListView();
            }
            showContextSelectInfo(menuItemIndex);
        } catch (JSONException e) {
            e.printStackTrace();
        }
        return true;
    }

    private void showContextSelectInfo(int menuItemIndex) {
        Context context = getApplicationContext();
        CharSequence text = menuItemIndex == 1 ? "Selected Yes" : "Selected No";
        int duration = Toast.LENGTH_SHORT;
        Toast toast = Toast.makeText(context, text, duration);
        toast.show();
    }

    private void setAutoList(JSONArray arr) throws JSONException {
        ArrayList<String> autoList = new ArrayList<String>();
        for (int i = 0; i < 5 && i < arr.length(); ++i) {
            JSONObject symbol = arr.getJSONObject(i);
            autoList.add(symbol.getString("Symbol")
                    + " - " + symbol.getString("Name")
                    + "(" + symbol.getString("Exchange") + ")");
            Log.d("KEY --- ", autoList.get(i));
        }
        ArrayAdapter arrAdp = new mArrayAdapter(this, android.R.layout.select_dialog_item, autoList);
        autoCompleteProgressBar.setVisibility(View.GONE);
        symbolView.setAdapter(arrAdp);
        symbolView.showDropDown();
    }

    private void refreshFavList() throws JSONException {
        updateArr = new ArrayList<JSONObject>();
        if (favArr != null && favArr.size() != 0) {
            favProgressBar.setVisibility(View.VISIBLE);
            for (int i = 0; i < favArr.size(); ++i) {
                HashMap<String, String> singleParams = new HashMap<>();
                singleParams.put("symbol", favArr.get(i).getString("symbol"));
                Log.d("AUTOREFRESH -- ", favArr.get(i).toString());
                NetworkManager.getInstance().getRequest(BASICINFOAPI, singleParams, new InformationListener<JSONObject>() {
                    @Override
                    public void getResult(JSONObject object) {
                        updateArr.add(object);
                        if (updateArr.size() >= favArr.size()) {
                            favProgressBar.setVisibility(View.GONE);
                            try {
                                resetFav();
                            } catch (JSONException e) {
                                e.printStackTrace();
                            }
                        }
                    }
                });
            }
        }
    }

    private void resetFav() throws JSONException {
        int successNum = 0;

        for (int i = 0; i < updateArr.size(); ++i) {
            JSONObject favObj = updateArr.get(i);
            if (favObj.length() != 0 && favObj.getString("status").equals("success")) {
                Log.d("RESETFAV", favObj.toString());

                String str = favObj.getString("symbol").toUpperCase();
                String pre = mPrefs.getString(str, null);
                if (pre != null) {
                    JSONObject preObj = new JSONObject(pre);
                    JSONObject newObj = favObj.getJSONObject("favData");
                    newObj.put("id", preObj.get("id"));

                    Log.d("RESETFAV1", pre);
                    Log.d("RESETFAV2", newObj.toString());

                    mEditor.putString(favObj.getString("symbol").toUpperCase(), newObj.toString());
                    mEditor.commit();
                }
                ++successNum;
            }
        }
        if (successNum != updateArr.size()) {
            showUpdateError();
        }
        fetchFavList();
        Collections.sort(favArr, new FavComparator(sortKey, sortMethod));
        setFavListView();

    }
    private void showUpdateError() {
        Context context = getApplicationContext();
        CharSequence text = "One or More Load Failed";
        int duration = Toast.LENGTH_SHORT;
        Toast toast = Toast.makeText(context, text, duration);
        toast.show();
    }

    // Render Fav list
    private void fetchFavList() throws JSONException {
        favArr = new ArrayList<JSONObject>();
        Map<String, ?> allEntries = mPrefs.getAll();
        for (Map.Entry<String, ?> entry : allEntries.entrySet()) {
            favArr.add(new JSONObject(entry.getValue().toString()));
        }
    }

    private void setFavListView() {
        if (favArr != null) {
            favAdapter = new FavListArrayAdapter(this, favArr);
            favListView.setAdapter(favAdapter);
            registerForContextMenu(favListView);
        }
    }

    @Override
    protected void onResume() {
        super.onResume();
        try {
            fetchFavList();
            setFavListView();
            refreshFavList();
        } catch (JSONException e) {
            e.printStackTrace();
        }
        Log.d(LOGCAT_TAG, "onResume() called");
    }

    @Override
    public void onPause() {
        super.onPause();  // Always call the superclass method first
        Log.d(LOGCAT_TAG, "onPause() called");

    }

    @Override
    protected void onStop() {
        // call the superclass method first
        super.onStop();
        Log.d(LOGCAT_TAG, "onStop() called");

    }


}
