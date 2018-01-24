---
layout: post.hbs
lang: en
deck: Piwik Analytics
title: Track deployments with Piwik’s Annotation API
description: >
    With Piwik’s Annotation API it’s simple to annotate each of your deployments automatically, which helps you interpreting changes in your metrics
date: 2014-04-25
---

*This article was originally written for the [Piwik Analytics Blog](http://piwik.org/blog/).*

Piwik allows you to annotate your analytics data in your dashboard to provide additional information, like the beginning of a new campaign or the launch of a new product.

![Piwik Dashboard: Adding annotations](/static/assets/article-piwik-annotations.png)

Another important – but often neglected – metric is the time of each deployment of your website or application. It helps you interpreting certain changes in your analytics data, as each release usually introduces new features or fixes important bugs. And those changes might also reflect in your statistics:

- »Our conversion rate improved by 10% since last week.« (»Yes, we rephrased our call to action message last Tuesday.«)
- »I’m seeing a spike of 404 errors.« (»One of our product pages had a typo in a link. I’ just fixed it a few minutes ago, the errors should be gone by now.«)
- »Since our last deployment, the traffic decreased on our service page.« (»Ok, last deployment you said? Let’s see what might have caused this …«)

Of course, you can do this all yourself, but wouldn’t it be great if all deployments were annotated automatically? Especially when you deploy your product often, it’s easy to lose track of what change was introduced at which point of time. With Piwik’s own Annotation API it’s actually quite simple to run this task with each of your releases.

During your deployment, run the following script:

```php
// Run with `php -f annotate-deployment.php` from the command line
<?php
$piwikUrl    = '<YOUR PIWIK DOMAIN>';
$piwikSiteId = '<YOUR PIWIK SITE ID>';
$piwikToken  = '<YOUR SECRET API TOKEN>';

$commitInfo = 'Deployment message';
$url = $piwikBUrl . '/?module=API' .
       '&method=Annotations.add&' .
       '&idSite=' . $piwikSiteId . 
       '&date=' . date( '%Y-%m-%d' ) .
       '&note=' . urlencode( $commitInfo ) .
       '&token_auth=' . $piwikToken;

file_get_contents($url);
?>
```

It calls the Annotation API for the project with the given site ID and adds the text of the parameter **note** to the given **date**. You can find your authentication token in your Piwik dashboard under the "API" link.

If you also want to add the deployed Git commit hash and message, replace your your note parameter with the following:

```php
$commitInfo = shell_exec( "env -i git log -1 --pretty=format:'Deployment [%h] %s' HEAD" );
```

This takes the last entry of your `git log HEAD` and formats it as `Deployment [<commit hash>] <commit message>`. And if you prefer a shell script over PHP, we have you covered as well:

```bash
curl -s "$PIWIK_URL/?module=API&\
method=Annotations.add&\
idSite=$PIWIK_SITE_ID&\
date=`date '+%Y-%m-%d'`&\
note=`env -i git log -1 --pretty=format:'Deployment [%h] %s' HEAD | perl -MURI::Escape -ne 'print uri_escape($_)'`&\
token_auth=$PIWIK_API_TOKEN"
```

![Piwik Dashboard: A list of generated deploy annotations with git commit hash](/static/assets/article-piwik-annotations-list.png)


For best results, add the IDs of your related issue tracker tickets to your deploy commit message. So you can track the changes in your development cycle all the way.

## A word about security

Make sure this script is not publicly accessible, as the API token works like a password to your entire Piwik installation. It’s recommended to create an additional user with administrative access to just this very project you want to track. Also, if the request is sent over untrusted networks, we highly advise that you use a HTTPS request instead.


### References
- [Reporting API Reference: Annotations Module](http://developer.piwik.org/api-reference/reporting-api#Annotations)
