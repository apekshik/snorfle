const axios = require('axios');

const bearerToken = 'xxx';
const searchQuery = 'best food in sf'; // Replace with your desired search term

const searchTwitter = async (query) => {
  try {
    const response = await axios.get('https://api.twitter.com/2/tweets/search/all', {
      headers: {
        'Authorization': `Bearer ${bearerToken}`
      },
      params: {
        'query': query,
        'tweet.fields': 'created_at,author_id,public_metrics',
        'expansions': 'author_id',
        'user.fields': 'name,username',
        'max_results': 100,
        'sort_order': 'relevancy'
      }
    });

    const tweets = response.data.data;
    const users = response.data.includes.users;

    // Sort tweets by engagement (using retweet_count + like_count as a simple metric)
    const sortedTweets = tweets.sort((a, b) => {
      const engagementA = a.public_metrics.retweet_count + a.public_metrics.like_count;
      const engagementB = b.public_metrics.retweet_count + b.public_metrics.like_count;
      return engagementB - engagementA;
    });

    var results = []
    // Display top 10 tweets
    sortedTweets.slice(0, 10).forEach(tweet => {
      const user = users.find(user => user.id === tweet.author_id);
      var obj = {}
      obj["username"] = user.username
      obj['content'] = tweet.text
      obj['created_at'] = tweet.created_at
      obj['like_count'] = tweet.public_metrics.like_count
      results.push(obj)
    });
    console.log(results)
  } catch (error) {
    console.error('Error searching Twitter:', error.response ? error.response.data : error.message);
  }
};

searchTwitter(searchQuery);