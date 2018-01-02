package com.jade.mystock;

import android.util.Log;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.HashMap;

/**
 * Created by logicRabbit on 11/19/17.
 */

public class InformationDataModel {

    private final String LOG_TAG = "InformationDataModel";
    private CurrentTab currentTab = new CurrentTab();
    private HistoricalTab historicalTab = new HistoricalTab();
    private NewsTab newsTab = new NewsTab();

    private final String BASICINFOAPI = "getBasicInfo";
    private final String HISAPI = "getHistorical";
    private final String NEWSAPI = "getNews";
    private final String INDICATORAPI = "getIndicatorInfo";
    private final String PRICEAPI = "getPrice";
    private final String[] INDICATORS = {"SMA", "EMA", "STOCH", "RSI", "ADX", "CCI", "BBANDS", "MACD"};
    private HashMap<String, String> singleParams = new HashMap<>();
    private HashMap<String, String> indicatorParams = new HashMap<>();

    public void setParams(String symbol) {
        singleParams.put("symbol", symbol);
    }
    public void setIndicatorParams(String symbol, String idx) {
        indicatorParams.put("symbol", symbol);
        indicatorParams.put("indicator", idx);
    }

    public CurrentTab getCurrentTab() {
        return this.currentTab;
    }
    public HistoricalTab getHistoricalTab() {
        return this.historicalTab;
    }
    public NewsTab getNewsTab() {
        return this.newsTab;
    }

    public void updateFav(final ArrayList<JSONObject> favArr) {

    }
    public void fetchData(final String symbol) {
        setParams(symbol);
        //Basic info
        currentTab.symbol = symbol.toUpperCase();
        NetworkManager.getInstance().getRequest(BASICINFOAPI, singleParams, new InformationListener<JSONObject>() {
            @Override
            public void getResult(JSONObject object) {
                if (object.length() != 0) {
                    Log.d(LOG_TAG, object.toString());
                    try {
                        currentTab.setBasicInfo(object);
                    } catch (JSONException e) {
                        e.printStackTrace();
                    }
                }
            }
        });
        //Historical Info
        NetworkManager.getInstance().getRequest(HISAPI, singleParams, new InformationListener<JSONObject>() {
            @Override
            public void getResult(JSONObject object) {
                if (object.length() != 0) {
                    Log.d(LOG_TAG, object.toString());
                    try {
                        historicalTab.setHistoricalWebView(object);
                    } catch (JSONException e) {
                        e.printStackTrace();
                    }
                }
            }
        });
        //News Info
        NetworkManager.getInstance().getRequest(NEWSAPI, singleParams, new InformationListener<JSONObject>() {
            @Override
            public void getResult(JSONObject object) {
                if (object.length() != 0) {
                    Log.d(LOG_TAG, object.toString());
                    try {
                        newsTab.setNewsFeed(object);
                    } catch (JSONException e) {
                        e.printStackTrace();
                    }
                }
            }
        });

        //Indicators Info
        for (int i = 0; i < INDICATORS.length; ++i) {
            setIndicatorParams(symbol, INDICATORS[i]);
            NetworkManager.getInstance().getIndicatorReq(INDICATORAPI, indicatorParams, i, new IndicatorListener<JSONObject>() {
                @Override
                public void getResult(JSONObject object, int i) {
                    if (object.length() != 0) {
                        try {
                            currentTab.setIndicatorsHashMap(object, i);
                        } catch (JSONException e) {
                            e.printStackTrace();
                        }
                    }
                }
            });
        }

        //Price
        NetworkManager.getInstance().getRequest(PRICEAPI, singleParams, new InformationListener<JSONObject>() {
            @Override
            public void getResult(JSONObject object) {
                if (object.length() != 0) {
                    Log.d(LOG_TAG, object.toString());
                    try {
                        currentTab.setPriceInfo(object);
                    } catch (JSONException e) {
                        e.printStackTrace();
                    }
                }
            }
        });

    }
}
