---
layout: post.hbs
lang: en
deck: Grafana
title: Annotate Grafana dashboards with deployments
intro: >
    Updates in your application stack can cause deviations in your metric graphs (for better or worse). Especially when you deploy often, it’s not always easy to quickly link cause and effect. Using annotations in Grafana, we can correlate changes in our graphs with deployments from our Continuous Integration pipeline.
date: 2018-01-22
---

To get started, we need Grafana 4.6 or above to be installed for the native annotation store. If you’re using an older version, you can use the same technique and store your annotations in [InfluxDB](https://www.influxdata.com/), for example.

For this tutorial, I’m using Docker to get the latest Grafana release running:

```bash
docker run -d --name=grafana -p 3000:3000 grafana/grafana
```


## Setup a new annotation in Grafana

Open Grafana in your browser on `http://localhost:3000` (default login is `admin`:`admin`), create a new dashboard and select _Dashboard > Annotations > New_.

Set the name to »Deployments« and check that the data source is set to »Grafana«. If you already use different annotations in your setup, make sure to set a filter by tag, so only the deployment annotations are shown:
  
![Grafana: Screenshot showing the new annotation setup](/static/assets/article-grafana-add-annotation.png)


## Create an API key

For external sources can write to Grafana, we need to create an API key first. Head to your terminal and run:

```bash
curl -XPOST 127.0.0.1:3000/api/auth/keys \
  -H "Content-Type: application/json" \
  --user "admin:admin" \
  --data @- << EOF
  {
    "name": "Deployment Annotations",
    "role": "Editor"
  }
EOF
```

This will give you a JSON response with a long `key` field. Store this key, as we’ll need it for all further API calls.


## Add annotation after deployment

The most interesting fields for an annotation are `text` and `tags`. You can look up further fields in the [HTTP API documentation](http://docs.grafana.org/http_api/annotations/). For `text`, you could include the name of the service deployed, the git commit hash and links to your CI system or GitHub. Set at least a tag called »deployment« for our filter, you can add tags for the environment, tier or data center.

At the end of each successful deployment send a HTTP request to Grafana. Make sure the JSON content is properly escaped:

```bash
curl -XPOST 127.0.0.1:3000/api/annotations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJrIj…oxfQ==" \
  --data @- << EOF
  {
    "text": "Deployed service 'backend-service'\n\n
      <a href=\"https://github.com/org/backend-service/commit/8ba7fb80\">GitHub (8ba7fb80)</a>\n
      <a href=\"http://ci.example.com/jenkins/job/backend-service/32/\">Jenkins (#32)</a>",
    "tags": [
      "deployment",
      "env:production",
      "tier:backend"
    ]
  }
EOF
```

Check the environment variables available in your CI system, they contain a lot of useful information to construct helpful links you may want to add.

This is what the final result looks like in Grafana:

![Grafana: Screenshot of the resulting annotation overlay window](/static/assets/article-grafana-deployment-annotation.png)

<div class="highlight-box">
  <strong>UPDATE:</strong> At the time of writing, Grafana doesn&#x2019;t limit the retention period for annotations. So if you plan to push <em>many</em> annotations, you may need to clean up Grafana&#x2019;s internal SQLite storage from time to time or switch to InfluxDB as data source, which has a <a href="https://docs.influxdata.com/influxdb/latest/query_language/database_management/#create-retention-policies-with-create-retention-policy">configurable retention policy</a>.
  <br>
  &#x2014; Thanks to <a href="https://twitter.com/IT_Supertramp/status/956202617931223043">Thomas</a> for asking about it.
</div>
