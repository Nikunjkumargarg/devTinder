const membershipPlans = {
    silver: {
        amount: 1000,
        currency: 'INR',
        duration: '1 month',
        features: ['1000 messages', '1000 likes', '1000 views', '1000 comments'],
    },
    gold: {
        amount: 2000,
        currency: 'INR',
        duration: '3 months',
        features: ['2000 messages', '2000 likes', '2000 views', '2000 comments'],
    },  
    platinum: {
        amount: 3000,
        currency: 'INR',
        duration: '6 months',
        features: ['3000 messages', '3000 likes', '3000 views', '3000 comments'],
    },
};

module.exports = membershipPlans;