package com.jade.mystock;

import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;
import android.widget.ImageView;
import android.widget.ListView;
import android.widget.ProgressBar;
import android.widget.TextView;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;

/**
 * Created by logicRabbit on 11/19/17.
 */

public class NewsTab extends Fragment {

    final String LOG_TAG = "TAB3";

    private class MyOnClickListener implements View.OnClickListener
    {
        String url;
        public MyOnClickListener(String url) {
            this.url = url;
        }
        @Override
        public void onClick(View v)
        {
            Intent i = new Intent(Intent.ACTION_VIEW);
            i.setData(Uri.parse(url));
            startActivity(i);
        }
    };

    private class NewsInfoArrayAdapter extends ArrayAdapter<JSONObject> {

        private final Context context;
        private final ArrayList<JSONObject> values;

        public NewsInfoArrayAdapter(Context context, ArrayList<JSONObject> values) {
            super(context, R.layout.news_info, values);
            this.context = context;
            this.values = values;
        }

        @Override
        public View getView(final int position, View convertView, ViewGroup parent) {
            LayoutInflater inflater = (LayoutInflater) context
                    .getSystemService(Context.LAYOUT_INFLATER_SERVICE);

            View rowView = inflater.inflate(R.layout.news_info, parent, false);

            TextView titleTextView = (TextView) rowView.findViewById(R.id.titleTextView);
            TextView authorTextView = (TextView) rowView.findViewById(R.id.authorTextView);
            TextView dateTextView = (TextView) rowView.findViewById(R.id.dateTextView);

            String url = "";
            try {
                titleTextView.setText(values.get(position).getString("title"));
                authorTextView.setText("Author: " + values.get(position).getString("author"));
                dateTextView.setText("Date: " + values.get(position).getString("pubDate"));
                url = values.get(position).getString("link");

            } catch (JSONException e) {
                e.printStackTrace();
            }
            rowView.setOnClickListener(new MyOnClickListener(url));
            return rowView;
        }
    }

    private int status = 0;
    private View rootView;
    private NewsInfoArrayAdapter madapter;
    private ArrayList<JSONObject> news;

    private ListView newsListView;
    private ProgressBar newsProgressBar;
    private TextView newsErrorText;

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {

        rootView = inflater.inflate(R.layout.news_tab, container, false);
        //News List
        newsListView = (ListView) rootView.findViewById(R.id.newsListView);
        //News Progress
        newsProgressBar = (ProgressBar) rootView.findViewById(R.id.newsProgressBar);
        //New Error Message
        newsErrorText = (TextView) rootView.findViewById(R.id.newsErrorText);

        setNewsFeed();
        return rootView;
    }

    // Set current status, will render view according current status
    private void setStatus(int currentStatus) {
        status = currentStatus;
        setNewsFeed();
    }

    private void setNewsFeed() {
        if (rootView != null) {
            switch (status) {
                case 0:
                    newsListView.setVisibility(View.GONE);
                    newsProgressBar.setVisibility(View.VISIBLE);
                    newsErrorText.setVisibility(View.GONE);
                    break;
                case 1:
                    madapter = new NewsInfoArrayAdapter(rootView.getContext(), news);
                    newsListView.setAdapter(madapter);
                    newsListView.setVisibility(View.VISIBLE);
                    newsProgressBar.setVisibility(View.GONE);
                    newsErrorText.setVisibility(View.GONE);
                    break;
                case 2:
                    newsListView.setVisibility(View.GONE);
                    newsProgressBar.setVisibility(View.GONE);
                    newsErrorText.setVisibility(View.VISIBLE);
                    break;
                default:
                    break;
            }
        }
    }

    public void setNewsFeed(JSONObject newsData) throws JSONException {
        Log.d(LOG_TAG, newsData.toString());
        if (newsData.getString("status").equals("success")) {
            JSONArray newsArr = newsData.getJSONArray("result");
            news = new ArrayList<JSONObject>();
            for (int i = 0; i < newsArr.length(); ++i) {
                news.add(newsArr.getJSONObject(i));
            }
            setStatus(1);
        }
        else {
            setStatus(2);
        }

    }
}