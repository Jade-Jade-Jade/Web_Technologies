package com.jade.mystock;

import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.webkit.JavascriptInterface;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.widget.ProgressBar;
import android.widget.TextView;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

/**
 * Created by logicRabbit on 11/19/17.
 */

public class HistoricalTab extends Fragment {

    final String LOG_TAG = "TAB2";

    private View rootView;
    private WebView historicalWebView;
    private ProgressBar historicalProgressBar;
    private TextView historicalErrorText;

    private HistoricalDataModel historicalDataModel;
    private int status = 0;

    private class HistoricalDataModel {
        private JSONObject historicalData;
        HistoricalDataModel(JSONObject data) {
            historicalData = data;
        }
        @JavascriptInterface
        public String getSymbol() throws JSONException {
            Log.d(LOG_TAG, historicalData.getString("symbol"));
            return historicalData.getString("symbol");
        }
        @JavascriptInterface
        public String getResult() throws JSONException {
            Log.d(LOG_TAG, historicalData.getString("result").toString());
            return historicalData.getString("result").toString();
        }
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        rootView = inflater.inflate(R.layout.historical_tab, container, false);

        // Get Web View
        historicalWebView = (WebView) rootView.findViewById(R.id.historicalWebView);
        WebSettings webSettings = historicalWebView.getSettings();
        webSettings.setJavaScriptEnabled(true);
        // Get Progress bar
        historicalProgressBar = (ProgressBar) rootView.findViewById(R.id.historicalProgressBar);
        // Get Error Message
        historicalErrorText = (TextView) rootView.findViewById(R.id.historicalErrorText);

        setHistoricalWebView();
        return rootView;
    }

    // Set current status, will render view according current status
    public void setStatus(int currentStatus) {
        status = currentStatus;
        setHistoricalWebView();
    }

    private void setHistoricalWebView() {
        if(rootView != null) {
            switch (status) {
                case 0:
                    historicalWebView.setVisibility(View.GONE);
                    historicalErrorText.setVisibility(View.GONE);
                    historicalProgressBar.setVisibility(View.VISIBLE);
                    break;
                case 1:
                    historicalWebView.addJavascriptInterface(historicalDataModel, "historicalData");
                    historicalWebView.loadUrl("file:///android_asset/historicalChart.html");
                    historicalWebView.setVisibility(View.VISIBLE);
                    historicalErrorText.setVisibility(View.GONE);
                    historicalProgressBar.setVisibility(View.GONE);
                    break;
                case 2:
                    historicalWebView.setVisibility(View.GONE);
                    historicalErrorText.setVisibility(View.VISIBLE);
                    historicalProgressBar.setVisibility(View.GONE);
                    break;
                default:
                    break;
            }
        }
    }

    public void setHistoricalWebView(JSONObject historicalData) throws JSONException {
        if (historicalData.getString("status").equals("success") && historicalData.getString("result").length() != 0) {
            historicalDataModel = new HistoricalDataModel(historicalData);
            setStatus(1);
        }
        else {
            setStatus(2);
        }
    }
}
