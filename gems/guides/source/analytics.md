# Analytics

Analytics are key to understanding user behaviour and enhancing a product

## Segment

There are many available services that provide analytics. Segment is the chosen one by default as it can connect multiple sources of analytics data to multiple destinations (Google Analytics, Mixpanel, Intercom, etc).

## Configuration

Create a Segment account add a workspace and add a javascript source for the client.

![](images/segment_source.png)

get the write key for the source and set it as `REACT_APP_SEGMENT_WRITE_KEY`

![](images/segment_write_key.png)
