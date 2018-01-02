package com.jade.mystock;

import android.content.Context;
import android.util.Log;

import com.android.volley.DefaultRetryPolicy;
import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.JsonArrayRequest;
import com.android.volley.toolbox.JsonObjectRequest;
import com.android.volley.toolbox.Volley;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.HashMap;
import java.util.Map;

/**
 * Created by logicRabbit on 11/19/17.
 */

public class NetworkManager {
    private static final String LOG_TAG = "NetworkManager";
    private static NetworkManager instance = null;

    private static final String prefixURL = "http://angular-express-env.quiexmfkcc.us-west-2.elasticbeanstalk.com/stockDetailApi/";
    //for Volley API
    public RequestQueue requestQueue;

    private NetworkManager(Context context)
    {
        requestQueue = Volley.newRequestQueue(context.getApplicationContext());
        //other stuf if you need
    }

    public static synchronized NetworkManager getInstance(Context context)
    {
        Log.d(LOG_TAG, "NetworkManager getInstance");
        if (null == instance)
            instance = new NetworkManager(context);
        return instance;
    }

    //this is so you don't need to pass context each time
    public static synchronized NetworkManager getInstance()
    {
        if (null == instance)
        {
            throw new IllegalStateException(NetworkManager.class.getSimpleName() +
                    " is not initialized, call getInstance(...) first");
        }
        return instance;
    }


    public void getAutoList(final String input, final InformationListener<JSONArray> listener)
    {

        String url = "http://angular-express-env.quiexmfkcc.us-west-2.elasticbeanstalk.com/guessSymbolApi?input=" + input;

        Log.d(LOG_TAG, "NetworkManager getRequest url is " + url);

        JsonArrayRequest request = new JsonArrayRequest(Request.Method.GET, url, null,
                new Response.Listener<JSONArray>()
                {
                    @Override
                    public void onResponse(JSONArray response)
                    {
                        Log.d(LOG_TAG + ": ", "somePostRequest Response : " + response.toString());
                        if(null != response.toString())
                            listener.getResult(response);
                    }
                },
                new Response.ErrorListener()
                {
                    @Override
                    public void onErrorResponse(VolleyError error)
                    {
                        Log.d(LOG_TAG + ": ", "somePostRequest Response : ERROR!!!!!!" + error.toString());
                        if (null != error.networkResponse)
                        {
                            Log.d(LOG_TAG + ": ", "Error Response code: " + error.networkResponse.statusCode);
                        }
                        try {
                            JSONArray ERROR = new JSONArray("[]");
                            listener.getResult(ERROR);
                        } catch (JSONException e) {
                            e.printStackTrace();
                        }
                    }
                });

        request.setRetryPolicy(new DefaultRetryPolicy(5000,
                DefaultRetryPolicy.DEFAULT_MAX_RETRIES,
                DefaultRetryPolicy.DEFAULT_BACKOFF_MULT));

        requestQueue.add(request);
    }



    public void getRequest(String api, HashMap<String, String> params, final InformationListener<JSONObject> listener)
    {

        String url = prefixURL + api + "?";
        for (HashMap.Entry<String, String> entry : params.entrySet()) {
            String key = entry.getKey();
            String value = entry.getValue();
            url += key + "=" + value + "&";
        }

        Log.d(LOG_TAG, "NetworkManager getRequest url is " + url);

        JsonObjectRequest request = new JsonObjectRequest(Request.Method.GET, url, null,
                new Response.Listener<JSONObject>()
                {
                    @Override
                    public void onResponse(JSONObject response)
                    {
                        Log.d(LOG_TAG + ": ", "somePostRequest Response : " + response.toString());
                        if(null != response.toString())
                            listener.getResult(response);
                    }
                },
                new Response.ErrorListener()
                {
                    @Override
                    public void onErrorResponse(VolleyError error)
                    {
                        Log.d(LOG_TAG + ": ", "somePostRequest Response : ERROR!!!!!!" + error.toString());
                        if (null != error.networkResponse)
                        {
                            Log.d(LOG_TAG + ": ", "Error Response code: " + error.networkResponse.statusCode);
                        }
                        try {
                            JSONObject ERROR = new JSONObject("{\"status\": \"error\"}");
                            listener.getResult(ERROR);
                        } catch (JSONException e) {
                            e.printStackTrace();
                        }
                    }
                });

        request.setRetryPolicy(new DefaultRetryPolicy(5000,
                DefaultRetryPolicy.DEFAULT_MAX_RETRIES,
                DefaultRetryPolicy.DEFAULT_BACKOFF_MULT));

        requestQueue.add(request);
    }


    public void getIndicatorReq(String api, HashMap<String, String> params, final int i, final IndicatorListener<JSONObject> listener)
    {

        String url = prefixURL + api + "?";
        for (HashMap.Entry<String, String> entry : params.entrySet()) {
            String key = entry.getKey();
            String value = entry.getValue();
            url += key + "=" + value + "&";
        }

        Log.d(LOG_TAG, "NetworkManager getRequest url is " + url);

        JsonObjectRequest request = new JsonObjectRequest(Request.Method.GET, url, null,
                new Response.Listener<JSONObject>()
                {
                    @Override
                    public void onResponse(JSONObject response)
                    {
                        Log.d(LOG_TAG + ": ", "somePostRequest Response : " + response.toString());
                        if(null != response.toString())
                            listener.getResult(response, i);
                    }
                },
                new Response.ErrorListener()
                {
                    @Override
                    public void onErrorResponse(VolleyError error)
                    {
                        Log.d(LOG_TAG + ": ", "somePostRequest Response : ERROR!!!!!!" + error.toString());
                        if (null != error.networkResponse)
                        {
                            Log.d(LOG_TAG + ": ", "Error Response code: " + error.networkResponse.statusCode);
                        }
                        try {
                            JSONObject ERROR = new JSONObject("{\"status\": \"error\"}");
                            listener.getResult(ERROR, i);
                        } catch (JSONException e) {
                            e.printStackTrace();
                        }
                    }
                });

        request.setRetryPolicy(new DefaultRetryPolicy(5000,
                DefaultRetryPolicy.DEFAULT_MAX_RETRIES,
                DefaultRetryPolicy.DEFAULT_BACKOFF_MULT));

        requestQueue.add(request);
    }

    public void cancelAll() {
        requestQueue.cancelAll(new RequestQueue.RequestFilter() {
            @Override
            public boolean apply(Request<?> request) {
                return true;
            }
        });
    }
}
