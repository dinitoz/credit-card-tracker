'use strict';
if ('serviceWorker' in navigator) { navigator.serviceWorker.register('./sw.js').catch(() => {}); }

// ── Categories ──
const CATEGORIES = [
  { id:'dining', name:'Dining', icon:'🍽️' },
  { id:'groceries', name:'Groceries', icon:'🛒' },
  { id:'gas', name:'Gas', icon:'⛽' },
  { id:'travel', name:'Travel', icon:'✈️' },
  { id:'flights', name:'Flights', icon:'🛫' },
  { id:'hotels', name:'Hotels', icon:'🏨' },
  { id:'streaming', name:'Streaming', icon:'📺' },
  { id:'online', name:'Online Shopping', icon:'🛍️' },
  { id:'drugstores', name:'Drugstores', icon:'💊' },
  { id:'transit', name:'Transit', icon:'🚌' },
  { id:'entertainment', name:'Entertainment', icon:'🎟️' },
  { id:'other', name:'Everything Else', icon:'💳' },
];

const COLORS = ['#1E3A5F','#0D47A1','#1565C0','#00695C','#2E7D32','#E65100','#BF360C','#4A148C','#880E4F','#37474F','#C62828','#AD1457','#6A1B9A','#283593','#004D40'];

// ── Preset Card Library ──
const PRESETS = [
  // ═══ CHASE ═══
  { issuer:'Chase', cardName:'Sapphire Preferred', annualFee:95, colorHex:'#1E3A5F',
    benefits:[
      {category:'dining',multiplier:3,pointType:'Chase UR'},
      {category:'groceries',multiplier:3,pointType:'Chase UR'},
      {category:'streaming',multiplier:3,pointType:'Chase UR'},
      {category:'online',multiplier:3,pointType:'Chase UR'},
      {category:'travel',multiplier:2,pointType:'Chase UR'},
      {category:'flights',multiplier:5,pointType:'Chase UR'},
      {category:'hotels',multiplier:5,pointType:'Chase UR'},
    ],
    perks:[
      {name:'$50 Hotel Credit',details:'Annual credit for Chase Travel hotel bookings',isAnnual:true},
      {name:'10% Anniversary Bonus',details:'10% of total purchases back as bonus points each year',isAnnual:true},
      {name:'Trip Cancellation Insurance',details:'Up to $10,000 per person',isAnnual:false},
      {name:'Primary Rental Car Insurance',details:'Covers theft and collision damage',isAnnual:false},
    ]},
  { issuer:'Chase', cardName:'Sapphire Reserve', annualFee:795, colorHex:'#283593',
    benefits:[
      {category:'dining',multiplier:3,pointType:'Chase UR'},
      {category:'flights',multiplier:4,pointType:'Chase UR'},
      {category:'hotels',multiplier:4,pointType:'Chase UR'},
      {category:'travel',multiplier:8,pointType:'Chase UR'},
    ],
    perks:[
      {name:'$500 The Edit Hotel Credit',details:'Two $250 credits per year for The Edit hotel bookings',isAnnual:true},
      {name:'$300 Travel Credit',details:'Annual statement credit for travel purchases',isAnnual:true},
      {name:'Priority Pass Lounge Access',details:'Unlimited visits for you and 2 guests',isAnnual:false},
      {name:'Global Entry / TSA PreCheck',details:'Up to $100 credit every 4 years',isAnnual:false},
      {name:'Primary Rental Car Insurance',details:'Covers theft and collision damage',isAnnual:false},
      {name:'1.5x Point Boost',details:'Points worth 50% more through Chase Travel',isAnnual:false},
    ]},
  { issuer:'Chase', cardName:'Freedom Unlimited', annualFee:0, colorHex:'#1565C0',
    benefits:[
      {category:'dining',multiplier:3,pointType:'Chase UR'},
      {category:'drugstores',multiplier:3,pointType:'Chase UR'},
      {category:'travel',multiplier:5,pointType:'Chase UR'},
      {category:'other',multiplier:1.5,pointType:'Chase UR'},
    ],
    perks:[
      {name:'0% Intro APR',details:'0% intro APR for 15 months on purchases and balance transfers',isAnnual:false},
    ]},
  { issuer:'Chase', cardName:'Freedom Flex', annualFee:0, colorHex:'#0D47A1',
    benefits:[
      {category:'dining',multiplier:3,pointType:'Chase UR'},
      {category:'drugstores',multiplier:3,pointType:'Chase UR'},
      {category:'travel',multiplier:5,pointType:'Chase UR'},
      {category:'other',multiplier:1,pointType:'Chase UR'},
    ],
    perks:[
      {name:'5% Rotating Categories',details:'5% on up to $1,500/quarter in rotating categories (activate required)',isAnnual:false},
      {name:'0% Intro APR',details:'0% intro APR for 15 months on purchases',isAnnual:false},
    ]},
  { issuer:'Chase', cardName:'Ink Business Preferred', annualFee:95, colorHex:'#1E3A5F',
    benefits:[
      {category:'travel',multiplier:3,pointType:'Chase UR'},
      {category:'online',multiplier:3,pointType:'Chase UR'},
      {category:'streaming',multiplier:3,pointType:'Chase UR'},
      {category:'other',multiplier:1,pointType:'Chase UR'},
    ],
    perks:[
      {name:'Cell Phone Protection',details:'Up to $1,000 per claim for damage/theft',isAnnual:false},
      {name:'Trip Cancellation Insurance',details:'Up to $5,000 per person',isAnnual:false},
    ]},
  { issuer:'Chase', cardName:'Ink Business Cash', annualFee:0, colorHex:'#00695C',
    benefits:[
      {category:'online',multiplier:5,pointType:'Chase UR'},
      {category:'streaming',multiplier:5,pointType:'Chase UR'},
      {category:'dining',multiplier:2,pointType:'Chase UR'},
      {category:'gas',multiplier:2,pointType:'Chase UR'},
      {category:'other',multiplier:1,pointType:'Chase UR'},
    ],
    perks:[
      {name:'Employee Cards',details:'Free employee cards with spending limits',isAnnual:false},
    ]},
  { issuer:'Chase', cardName:'Ink Business Unlimited', annualFee:0, colorHex:'#004D40',
    benefits:[
      {category:'other',multiplier:1.5,pointType:'Chase UR'},
    ],
    perks:[
      {name:'0% Intro APR',details:'0% intro APR for 12 months on purchases',isAnnual:false},
    ]},
  // ── Chase Co-branded ──
  { issuer:'Chase', cardName:'United Explorer', annualFee:150, colorHex:'#283593',
    benefits:[
      {category:'dining',multiplier:2,pointType:'United Miles'},
      {category:'hotels',multiplier:2,pointType:'United Miles'},
      {category:'flights',multiplier:2,pointType:'United Miles'},
      {category:'other',multiplier:1,pointType:'United Miles'},
    ],
    perks:[
      {name:'First Checked Bag Free',details:'Free first checked bag on United flights for you and a companion',isAnnual:false},
      {name:'Priority Boarding',details:'Group 2 boarding on United flights',isAnnual:false},
      {name:'2 United Club Passes',details:'Two one-time United Club lounge passes per year',isAnnual:true},
      {name:'25% Back on Inflight',details:'25% back as statement credit on United inflight purchases',isAnnual:false},
      {name:'Global Entry / TSA PreCheck',details:'Up to $100 credit',isAnnual:false},
    ]},
  { issuer:'Chase', cardName:'United Quest', annualFee:250, colorHex:'#1E3A5F',
    benefits:[
      {category:'dining',multiplier:3,pointType:'United Miles'},
      {category:'hotels',multiplier:2,pointType:'United Miles'},
      {category:'flights',multiplier:2,pointType:'United Miles'},
      {category:'other',multiplier:1,pointType:'United Miles'},
    ],
    perks:[
      {name:'$125 United Credit',details:'$125 annual credit for United purchases',isAnnual:true},
      {name:'First & Second Bag Free',details:'Free first and second checked bags on United flights',isAnnual:false},
      {name:'Priority Boarding',details:'Group 2 boarding on United flights',isAnnual:false},
      {name:'5,000 PQP Head Start',details:'5,000 Premier Qualifying Points each year',isAnnual:true},
      {name:'Global Entry / TSA PreCheck',details:'Up to $100 credit',isAnnual:false},
    ]},
  { issuer:'Chase', cardName:'United Club Infinite', annualFee:525, colorHex:'#37474F',
    benefits:[
      {category:'flights',multiplier:5,pointType:'United Miles'},
      {category:'dining',multiplier:2,pointType:'United Miles'},
      {category:'hotels',multiplier:2,pointType:'United Miles'},
      {category:'other',multiplier:1,pointType:'United Miles'},
    ],
    perks:[
      {name:'United Club Membership',details:'Full United Club lounge access for you and 2 guests',isAnnual:false},
      {name:'First & Second Bag Free',details:'Free first and second checked bags on United flights',isAnnual:false},
      {name:'Priority Boarding',details:'Group 1 boarding on United flights',isAnnual:false},
      {name:'1,500 PQP Head Start',details:'1,500 Premier Qualifying Points each year',isAnnual:true},
      {name:'Global Entry / TSA PreCheck',details:'Up to $100 credit',isAnnual:false},
    ]},
  { issuer:'Chase', cardName:'Southwest Priority', annualFee:229, colorHex:'#C62828',
    benefits:[
      {category:'flights',multiplier:3,pointType:'SW Points'},
      {category:'dining',multiplier:2,pointType:'SW Points'},
      {category:'groceries',multiplier:2,pointType:'SW Points'},
      {category:'gas',multiplier:2,pointType:'SW Points'},
      {category:'streaming',multiplier:2,pointType:'SW Points'},
      {category:'other',multiplier:1,pointType:'SW Points'},
    ],
    perks:[
      {name:'$75 Southwest Credit',details:'$75 annual Southwest travel credit',isAnnual:true},
      {name:'7,500 Anniversary Points',details:'7,500 bonus points each card anniversary',isAnnual:true},
      {name:'4 Upgraded Boardings',details:'4 upgraded boardings per year when available',isAnnual:true},
      {name:'Companion Pass Qualifying',details:'Points count toward Companion Pass',isAnnual:false},
    ]},
  { issuer:'Chase', cardName:'Southwest Premier', annualFee:149, colorHex:'#AD1457',
    benefits:[
      {category:'flights',multiplier:3,pointType:'SW Points'},
      {category:'dining',multiplier:2,pointType:'SW Points'},
      {category:'groceries',multiplier:2,pointType:'SW Points'},
      {category:'gas',multiplier:2,pointType:'SW Points'},
      {category:'streaming',multiplier:2,pointType:'SW Points'},
      {category:'other',multiplier:1,pointType:'SW Points'},
    ],
    perks:[
      {name:'6,000 Anniversary Points',details:'6,000 bonus points each card anniversary',isAnnual:true},
      {name:'2 EarlyBird Check-Ins',details:'2 free EarlyBird Check-In passes per year',isAnnual:true},
      {name:'Companion Pass Qualifying',details:'Points count toward Companion Pass',isAnnual:false},
    ]},
  { issuer:'Chase', cardName:'Southwest Plus', annualFee:99, colorHex:'#BF360C',
    benefits:[
      {category:'flights',multiplier:2,pointType:'SW Points'},
      {category:'gas',multiplier:2,pointType:'SW Points'},
      {category:'groceries',multiplier:2,pointType:'SW Points'},
      {category:'other',multiplier:1,pointType:'SW Points'},
    ],
    perks:[
      {name:'3,000 Anniversary Points',details:'3,000 bonus points each card anniversary',isAnnual:true},
      {name:'Companion Pass Qualifying',details:'Points count toward Companion Pass',isAnnual:false},
    ]},
  { issuer:'Chase', cardName:'World of Hyatt', annualFee:95, colorHex:'#4A148C',
    benefits:[
      {category:'hotels',multiplier:4,pointType:'Hyatt Points'},
      {category:'dining',multiplier:2,pointType:'Hyatt Points'},
      {category:'flights',multiplier:2,pointType:'Hyatt Points'},
      {category:'transit',multiplier:2,pointType:'Hyatt Points'},
      {category:'other',multiplier:1,pointType:'Hyatt Points'},
    ],
    perks:[
      {name:'Free Night Award',details:'One free night (up to 15,000 points) each card anniversary',isAnnual:true},
      {name:'Discoverist Status',details:'Automatic World of Hyatt Discoverist elite status',isAnnual:false},
      {name:'5 Qualifying Night Credits',details:'5 tier-qualifying night credits each year',isAnnual:true},
      {name:'Extra Free Night',details:'Earn another free night after $15,000 spend in a year',isAnnual:true},
    ]},
  { issuer:'Chase', cardName:'Marriott Bonvoy Boundless', annualFee:95, colorHex:'#6A1B9A',
    benefits:[
      {category:'hotels',multiplier:6,pointType:'Marriott Points'},
      {category:'groceries',multiplier:3,pointType:'Marriott Points'},
      {category:'gas',multiplier:3,pointType:'Marriott Points'},
      {category:'dining',multiplier:3,pointType:'Marriott Points'},
      {category:'other',multiplier:2,pointType:'Marriott Points'},
    ],
    perks:[
      {name:'Free Night Award',details:'One free night (up to 35,000 points) each card anniversary',isAnnual:true},
      {name:'Silver Elite Status',details:'Automatic Marriott Bonvoy Silver Elite status',isAnnual:false},
      {name:'15 Elite Night Credits',details:'15 elite night credits toward next status level',isAnnual:true},
    ]},
  { issuer:'Chase', cardName:'Marriott Bonvoy Bold', annualFee:0, colorHex:'#880E4F',
    benefits:[
      {category:'hotels',multiplier:3,pointType:'Marriott Points'},
      {category:'dining',multiplier:2,pointType:'Marriott Points'},
      {category:'groceries',multiplier:2,pointType:'Marriott Points'},
      {category:'other',multiplier:1,pointType:'Marriott Points'},
    ],
    perks:[
      {name:'Silver Elite Status',details:'Automatic Marriott Bonvoy Silver Elite status',isAnnual:false},
      {name:'15 Elite Night Credits',details:'15 elite night credits toward next status level',isAnnual:true},
    ]},
  { issuer:'Chase', cardName:'IHG One Rewards Premier', annualFee:99, colorHex:'#2E7D32',
    benefits:[
      {category:'hotels',multiplier:10,pointType:'IHG Points'},
      {category:'dining',multiplier:5,pointType:'IHG Points'},
      {category:'gas',multiplier:5,pointType:'IHG Points'},
      {category:'travel',multiplier:5,pointType:'IHG Points'},
      {category:'other',multiplier:3,pointType:'IHG Points'},
    ],
    perks:[
      {name:'Free Night Award',details:'One free night (up to 40,000 points) each card anniversary',isAnnual:true},
      {name:'Platinum Elite Status',details:'Automatic IHG One Rewards Platinum Elite status',isAnnual:false},
      {name:'4th Night Free',details:'4th night free on award stays of 4+ nights',isAnnual:false},
      {name:'Global Entry / TSA PreCheck',details:'Up to $100 credit',isAnnual:false},
    ]},
  { issuer:'Chase', cardName:'IHG One Rewards Traveler', annualFee:0, colorHex:'#00695C',
    benefits:[
      {category:'hotels',multiplier:3,pointType:'IHG Points'},
      {category:'dining',multiplier:3,pointType:'IHG Points'},
      {category:'gas',multiplier:3,pointType:'IHG Points'},
      {category:'streaming',multiplier:3,pointType:'IHG Points'},
      {category:'other',multiplier:1,pointType:'IHG Points'},
    ],
    perks:[
      {name:'Silver Elite Status',details:'Automatic IHG One Rewards Silver Elite status',isAnnual:false},
    ]},
  { issuer:'Chase', cardName:'Aeroplan', annualFee:95, colorHex:'#004D40',
    benefits:[
      {category:'dining',multiplier:3,pointType:'Aeroplan Points'},
      {category:'groceries',multiplier:3,pointType:'Aeroplan Points'},
      {category:'flights',multiplier:3,pointType:'Aeroplan Points'},
      {category:'other',multiplier:1,pointType:'Aeroplan Points'},
    ],
    perks:[
      {name:'Aeroplan 25K Status',details:'Automatic Aeroplan 25K elite status',isAnnual:false},
      {name:'Free First Checked Bag',details:'Free first checked bag on Air Canada flights',isAnnual:false},
      {name:'Priority Boarding',details:'Priority boarding on Air Canada flights',isAnnual:false},
      {name:'500 Bonus Miles/Month',details:'Earn 500 bonus miles for every $2,000 spent per month (up to 1,500)',isAnnual:false},
      {name:'Global Entry / TSA PreCheck',details:'Up to $100 credit',isAnnual:false},
    ]},

  // ═══ AMEX ═══
  { issuer:'Amex', cardName:'Platinum', annualFee:895, colorHex:'#37474F',
    benefits:[
      {category:'flights',multiplier:5,pointType:'Amex MR'},
      {category:'hotels',multiplier:5,pointType:'Amex MR'},
      {category:'other',multiplier:1,pointType:'Amex MR'},
    ],
    perks:[
      {name:'$200 Airline Fee Credit',details:'Annual credit for incidental fees on one selected airline',isAnnual:true},
      {name:'$200 Uber Cash',details:'$15/month + $35 in December for Uber rides and Uber Eats',isAnnual:true},
      {name:'$400 Resy Dining Credit',details:'Up to $400/year in statement credits at Resy restaurants',isAnnual:true},
      {name:'$600 Hotel Credit',details:'Up to $600/year for Fine Hotels + Resorts and Hotel Collection',isAnnual:true},
      {name:'$300 Digital Entertainment',details:'Up to $25/month for streaming, news, and music subscriptions',isAnnual:true},
      {name:'Centurion Lounge Access',details:'Access to Amex Centurion Lounges worldwide',isAnnual:false},
      {name:'Priority Pass',details:'Unlimited Priority Pass lounge visits',isAnnual:false},
      {name:'Hilton Gold Status',details:'Complimentary Hilton Honors Gold status',isAnnual:false},
      {name:'Marriott Gold Status',details:'Complimentary Marriott Bonvoy Gold status',isAnnual:false},
      {name:'Global Entry / TSA PreCheck',details:'Up to $100 credit every 4 years',isAnnual:false},
    ]},
  { issuer:'Amex', cardName:'Gold', annualFee:325, colorHex:'#E65100',
    benefits:[
      {category:'dining',multiplier:4,pointType:'Amex MR'},
      {category:'groceries',multiplier:4,pointType:'Amex MR'},
      {category:'flights',multiplier:3,pointType:'Amex MR'},
      {category:'other',multiplier:1,pointType:'Amex MR'},
    ],
    perks:[
      {name:'$120 Uber Cash',details:'$10/month for Uber Eats orders',isAnnual:true},
      {name:'$120 Dining Credit',details:'$10/month at select restaurants (Grubhub, Seamless, etc.)',isAnnual:true},
      {name:'$84 Dunkin Credit',details:'$7/month at Dunkin through the Amex app',isAnnual:true},
      {name:'$100 Resy Credit',details:'Up to $100/year in statement credits at Resy restaurants',isAnnual:true},
    ]},
  { issuer:'Amex', cardName:'Green', annualFee:150, colorHex:'#2E7D32',
    benefits:[
      {category:'dining',multiplier:3,pointType:'Amex MR'},
      {category:'travel',multiplier:3,pointType:'Amex MR'},
      {category:'flights',multiplier:3,pointType:'Amex MR'},
      {category:'hotels',multiplier:3,pointType:'Amex MR'},
      {category:'transit',multiplier:3,pointType:'Amex MR'},
      {category:'other',multiplier:1,pointType:'Amex MR'},
    ],
    perks:[
      {name:'$189 CLEAR Plus Credit',details:'Annual statement credit for CLEAR Plus membership',isAnnual:true},
      {name:'LoungeBuddy',details:'$100 annual credit for LoungeBuddy airport lounge access',isAnnual:true},
    ]},
  { issuer:'Amex', cardName:'Blue Cash Preferred', annualFee:95, colorHex:'#0D47A1',
    benefits:[
      {category:'groceries',multiplier:6,pointType:'Cash Back'},
      {category:'streaming',multiplier:6,pointType:'Cash Back'},
      {category:'gas',multiplier:3,pointType:'Cash Back'},
      {category:'transit',multiplier:3,pointType:'Cash Back'},
      {category:'other',multiplier:1,pointType:'Cash Back'},
    ],
    perks:[
      {name:'$84 Disney Bundle Credit',details:'$7/month toward a Disney Bundle subscription',isAnnual:true},
      {name:'0% Intro APR',details:'0% intro APR for 12 months on purchases and balance transfers',isAnnual:false},
    ]},
  { issuer:'Amex', cardName:'Blue Cash Everyday', annualFee:0, colorHex:'#1565C0',
    benefits:[
      {category:'groceries',multiplier:3,pointType:'Cash Back'},
      {category:'online',multiplier:3,pointType:'Cash Back'},
      {category:'gas',multiplier:3,pointType:'Cash Back'},
      {category:'other',multiplier:1,pointType:'Cash Back'},
    ],
    perks:[
      {name:'0% Intro APR',details:'0% intro APR for 15 months on purchases and balance transfers',isAnnual:false},
    ]},
  { issuer:'Amex', cardName:'Business Platinum', annualFee:895, colorHex:'#37474F',
    benefits:[
      {category:'flights',multiplier:5,pointType:'Amex MR'},
      {category:'hotels',multiplier:5,pointType:'Amex MR'},
      {category:'other',multiplier:1.5,pointType:'Amex MR'},
    ],
    perks:[
      {name:'$600 FHR Credit',details:'Annual credit for Fine Hotels + Resorts bookings',isAnnual:true},
      {name:'$200 Airline Fee Credit',details:'Annual credit for incidental airline fees',isAnnual:true},
      {name:'$150 Dell Credit',details:'Semi-annual Dell Technologies credits',isAnnual:true},
      {name:'$120 Adobe Credit',details:'Annual credit for Adobe Creative Cloud',isAnnual:true},
      {name:'Centurion Lounge Access',details:'Access to Amex Centurion Lounges',isAnnual:false},
      {name:'35% Airline Rebate',details:'35% points back on selected airline business/first class',isAnnual:false},
    ]},
  { issuer:'Amex', cardName:'Business Gold', annualFee:375, colorHex:'#BF360C',
    benefits:[
      {category:'flights',multiplier:4,pointType:'Amex MR'},
      {category:'dining',multiplier:4,pointType:'Amex MR'},
      {category:'gas',multiplier:4,pointType:'Amex MR'},
      {category:'online',multiplier:4,pointType:'Amex MR'},
      {category:'other',multiplier:1,pointType:'Amex MR'},
    ],
    perks:[
      {name:'25% Airline Rebate',details:'25% points back on flights booked through Amex Travel',isAnnual:false},
    ]},
  { issuer:'Amex', cardName:'Blue Business Plus', annualFee:0, colorHex:'#283593',
    benefits:[
      {category:'other',multiplier:2,pointType:'Amex MR'},
    ],
    perks:[
      {name:'0% Intro APR',details:'0% intro APR for 12 months on purchases',isAnnual:false},
      {name:'Expanded Buying Power',details:'Ability to spend above credit limit',isAnnual:false},
    ]},
  { issuer:'Amex', cardName:'Hilton Honors', annualFee:0, colorHex:'#004D40',
    benefits:[
      {category:'dining',multiplier:5,pointType:'Hilton Points'},
      {category:'groceries',multiplier:5,pointType:'Hilton Points'},
      {category:'gas',multiplier:5,pointType:'Hilton Points'},
      {category:'hotels',multiplier:7,pointType:'Hilton Points'},
      {category:'other',multiplier:3,pointType:'Hilton Points'},
    ],
    perks:[
      {name:'Hilton Silver Status',details:'Complimentary Hilton Honors Silver status',isAnnual:false},
    ]},
  { issuer:'Amex', cardName:'Hilton Honors Surpass', annualFee:150, colorHex:'#880E4F',
    benefits:[
      {category:'dining',multiplier:6,pointType:'Hilton Points'},
      {category:'groceries',multiplier:6,pointType:'Hilton Points'},
      {category:'gas',multiplier:6,pointType:'Hilton Points'},
      {category:'hotels',multiplier:12,pointType:'Hilton Points'},
      {category:'other',multiplier:3,pointType:'Hilton Points'},
    ],
    perks:[
      {name:'Hilton Gold Status',details:'Complimentary Hilton Honors Gold status',isAnnual:false},
      {name:'Free Night Reward',details:'Free night after spending $15,000 in a year',isAnnual:true},
      {name:'Priority Pass',details:'10 Priority Pass lounge visits per year',isAnnual:true},
    ]},
  { issuer:'Amex', cardName:'Marriott Bonvoy Brilliant', annualFee:650, colorHex:'#6A1B9A',
    benefits:[
      {category:'dining',multiplier:3,pointType:'Marriott Points'},
      {category:'flights',multiplier:3,pointType:'Marriott Points'},
      {category:'hotels',multiplier:6,pointType:'Marriott Points'},
      {category:'other',multiplier:2,pointType:'Marriott Points'},
    ],
    perks:[
      {name:'Free Night Award',details:'Annual free night up to 85,000 points value',isAnnual:true},
      {name:'$300 Dining Credit',details:'$25/month at restaurants worldwide',isAnnual:true},
      {name:'Marriott Platinum Status',details:'Complimentary Marriott Bonvoy Platinum Elite status',isAnnual:false},
      {name:'Priority Pass',details:'Unlimited Priority Pass lounge visits',isAnnual:false},
    ]},
  { issuer:'Amex', cardName:'Delta SkyMiles Gold', annualFee:150, colorHex:'#E65100',
    benefits:[
      {category:'dining',multiplier:2,pointType:'Delta Miles'},
      {category:'flights',multiplier:2,pointType:'Delta Miles'},
      {category:'groceries',multiplier:2,pointType:'Delta Miles'},
      {category:'other',multiplier:1,pointType:'Delta Miles'},
    ],
    perks:[
      {name:'First Checked Bag Free',details:'Free first checked bag on Delta flights',isAnnual:false},
      {name:'$200 Delta Flight Credit',details:'After spending $10,000 in a year',isAnnual:true},
    ]},
  { issuer:'Amex', cardName:'Delta SkyMiles Platinum', annualFee:350, colorHex:'#37474F',
    benefits:[
      {category:'dining',multiplier:3,pointType:'Delta Miles'},
      {category:'flights',multiplier:3,pointType:'Delta Miles'},
      {category:'hotels',multiplier:3,pointType:'Delta Miles'},
      {category:'groceries',multiplier:2,pointType:'Delta Miles'},
      {category:'other',multiplier:1,pointType:'Delta Miles'},
    ],
    perks:[
      {name:'First Checked Bag Free',details:'Free first checked bag on Delta flights',isAnnual:false},
      {name:'Companion Certificate',details:'Annual domestic companion certificate after spending $10,000',isAnnual:true},
      {name:'Delta Sky Club Access',details:'Discounted access at $50/visit',isAnnual:false},
    ]},
  // ═══ CITI ═══
  { issuer:'Citi', cardName:'Strata Premier', annualFee:95, colorHex:'#0D47A1',
    benefits:[
      {category:'dining',multiplier:3,pointType:'Citi TY'},
      {category:'groceries',multiplier:3,pointType:'Citi TY'},
      {category:'gas',multiplier:3,pointType:'Citi TY'},
      {category:'flights',multiplier:3,pointType:'Citi TY'},
      {category:'hotels',multiplier:3,pointType:'Citi TY'},
      {category:'travel',multiplier:10,pointType:'Citi TY'},
      {category:'other',multiplier:1,pointType:'Citi TY'},
    ],
    perks:[
      {name:'$100 Hotel Credit',details:'Annual credit for hotel stays of $500+ booked through Citi Travel',isAnnual:true},
      {name:'Transfer Partners',details:'Transfer points to airlines like AA, JetBlue, Singapore, and more',isAnnual:false},
    ]},
  { issuer:'Citi', cardName:'Strata', annualFee:0, colorHex:'#1565C0',
    benefits:[
      {category:'dining',multiplier:2,pointType:'Citi TY'},
      {category:'groceries',multiplier:2,pointType:'Citi TY'},
      {category:'gas',multiplier:2,pointType:'Citi TY'},
      {category:'entertainment',multiplier:2,pointType:'Citi TY'},
      {category:'other',multiplier:1,pointType:'Citi TY'},
    ],
    perks:[
      {name:'Transfer Partners',details:'Transfer points to airline and hotel partners',isAnnual:false},
    ]},
  { issuer:'Citi', cardName:'Custom Cash', annualFee:0, colorHex:'#00695C',
    benefits:[
      {category:'other',multiplier:5,pointType:'Cash Back'},
    ],
    perks:[
      {name:'Auto 5% Top Category',details:'5% on your top eligible spend category each billing cycle (up to $500)',isAnnual:false},
      {name:'0% Intro APR',details:'0% intro APR for 15 months on purchases and balance transfers',isAnnual:false},
    ]},
  { issuer:'Citi', cardName:'Double Cash', annualFee:0, colorHex:'#1E3A5F',
    benefits:[
      {category:'other',multiplier:2,pointType:'Cash Back / Citi TY'},
    ],
    perks:[
      {name:'2% Everywhere',details:'1% when you buy + 1% when you pay your bill = 2% on everything',isAnnual:false},
      {name:'Transfer Partners',details:'Convert cash back to Citi TY points when paired with Strata Premier',isAnnual:false},
    ]},
  { issuer:'Citi', cardName:'Costco Anywhere Visa', annualFee:0, colorHex:'#C62828',
    benefits:[
      {category:'gas',multiplier:5,pointType:'Cash Back'},
      {category:'dining',multiplier:3,pointType:'Cash Back'},
      {category:'travel',multiplier:3,pointType:'Cash Back'},
      {category:'flights',multiplier:3,pointType:'Cash Back'},
      {category:'hotels',multiplier:3,pointType:'Cash Back'},
      {category:'groceries',multiplier:2,pointType:'Cash Back'},
      {category:'other',multiplier:1,pointType:'Cash Back'},
    ],
    perks:[
      {name:'5% Costco Gas',details:'5% at Costco gas stations, 4% other gas/EV charging (combined $7,000/yr cap)',isAnnual:true},
      {name:'2% at Costco',details:'2% on all Costco and Costco.com purchases',isAnnual:false},
      {name:'Costco Membership Required',details:'Must be an active Costco member to hold this card',isAnnual:false},
      {name:'Annual Reward Certificate',details:'Cash back issued as annual reward certificate redeemable at Costco',isAnnual:true},
    ]},
  { issuer:'Citi', cardName:'AAdvantage Platinum Select', annualFee:99, colorHex:'#AD1457',
    benefits:[
      {category:'dining',multiplier:2,pointType:'AA Miles'},
      {category:'gas',multiplier:2,pointType:'AA Miles'},
      {category:'flights',multiplier:2,pointType:'AA Miles'},
      {category:'other',multiplier:1,pointType:'AA Miles'},
    ],
    perks:[
      {name:'First Checked Bag Free',details:'Free first checked bag on AA domestic flights',isAnnual:false},
      {name:'Preferred Boarding',details:'Group 5 boarding on American Airlines flights',isAnnual:false},
      {name:'$125 AA Flight Discount',details:'$125 off a $750+ AA flight after spending $20,000',isAnnual:true},
    ]},

  { issuer:'Citi', cardName:'AAdvantage Business', annualFee:99, colorHex:'#C62828',
    benefits:[
      {category:'flights',multiplier:2,pointType:'AA Miles'},
      {category:'dining',multiplier:2,pointType:'AA Miles'},
      {category:'gas',multiplier:2,pointType:'AA Miles'},
      {category:'online',multiplier:2,pointType:'AA Miles'},
      {category:'other',multiplier:1,pointType:'AA Miles'},
    ],
    perks:[
      {name:'First Checked Bag Free',details:'Free first checked bag on AA domestic flights for you and up to 8 companions',isAnnual:false},
      {name:'Preferred Boarding',details:'Group 5 boarding on American Airlines flights',isAnnual:false},
      {name:'Loyalty Points',details:'Earn 1 Loyalty Point per $1 spent toward AA elite status',isAnnual:false},
      {name:'25% Inflight Savings',details:'25% back on inflight food, beverages, and Wi-Fi',isAnnual:false},
    ]},
  { issuer:'Citi', cardName:'AAdvantage Executive', annualFee:595, colorHex:'#37474F',
    benefits:[
      {category:'flights',multiplier:4,pointType:'AA Miles'},
      {category:'dining',multiplier:2,pointType:'AA Miles'},
      {category:'hotels',multiplier:2,pointType:'AA Miles'},
      {category:'other',multiplier:1,pointType:'AA Miles'},
    ],
    perks:[
      {name:'Admirals Club Access',details:'Admirals Club membership for you and authorized users',isAnnual:false},
      {name:'First & Second Bag Free',details:'Free first and second checked bags on AA flights',isAnnual:false},
      {name:'Priority Boarding',details:'Group 1 boarding on American Airlines flights',isAnnual:false},
      {name:'Global Entry / TSA PreCheck',details:'Up to $100 credit',isAnnual:false},
    ]},

  // ═══ CAPITAL ONE (bonus) ═══
  { issuer:'Capital One', cardName:'Venture X', annualFee:395, colorHex:'#283593',
    benefits:[
      {category:'flights',multiplier:5,pointType:'Cap One Miles'},
      {category:'hotels',multiplier:10,pointType:'Cap One Miles'},
      {category:'travel',multiplier:10,pointType:'Cap One Miles'},
      {category:'other',multiplier:2,pointType:'Cap One Miles'},
    ],
    perks:[
      {name:'$300 Travel Credit',details:'Annual credit for bookings through Capital One Travel',isAnnual:true},
      {name:'10,000 Anniversary Miles',details:'10,000 bonus miles every account anniversary',isAnnual:true},
      {name:'Capital One Lounge Access',details:'Access to Capital One Lounges and Priority Pass',isAnnual:false},
      {name:'Global Entry / TSA PreCheck',details:'Up to $100 credit every 4 years',isAnnual:false},
    ]},
  { issuer:'Capital One', cardName:'Savor', annualFee:95, colorHex:'#BF360C',
    benefits:[
      {category:'dining',multiplier:4,pointType:'Cash Back'},
      {category:'entertainment',multiplier:4,pointType:'Cash Back'},
      {category:'groceries',multiplier:3,pointType:'Cash Back'},
      {category:'streaming',multiplier:4,pointType:'Cash Back'},
      {category:'other',multiplier:1,pointType:'Cash Back'},
    ],
    perks:[
      {name:'Transfer to Miles',details:'Convert cash back to Capital One miles 1:1 when paired with Venture X',isAnnual:false},
    ]},
  { issuer:'Capital One', cardName:'SavorOne', annualFee:0, colorHex:'#E65100',
    benefits:[
      {category:'dining',multiplier:3,pointType:'Cash Back'},
      {category:'entertainment',multiplier:3,pointType:'Cash Back'},
      {category:'groceries',multiplier:3,pointType:'Cash Back'},
      {category:'streaming',multiplier:3,pointType:'Cash Back'},
      {category:'other',multiplier:1,pointType:'Cash Back'},
    ],
    perks:[
      {name:'Transfer to Miles',details:'Convert cash back to Capital One miles 1:1 when paired with Venture/Venture X',isAnnual:false},
    ]},
  { issuer:'Capital One', cardName:'Venture', annualFee:95, colorHex:'#004D40',
    benefits:[
      {category:'hotels',multiplier:5,pointType:'Cap One Miles'},
      {category:'travel',multiplier:5,pointType:'Cap One Miles'},
      {category:'other',multiplier:2,pointType:'Cap One Miles'},
    ],
    perks:[
      {name:'Global Entry / TSA PreCheck',details:'Up to $100 credit',isAnnual:false},
      {name:'Transfer Partners',details:'Transfer miles to 15+ airline and hotel partners',isAnnual:false},
    ]},

  { issuer:'Capital One', cardName:'Venture X Business', annualFee:395, colorHex:'#1E3A5F',
    benefits:[
      {category:'travel',multiplier:10,pointType:'Cap One Miles'},
      {category:'hotels',multiplier:5,pointType:'Cap One Miles'},
      {category:'flights',multiplier:5,pointType:'Cap One Miles'},
      {category:'other',multiplier:2,pointType:'Cap One Miles'},
    ],
    perks:[
      {name:'$300 Travel Credit',details:'Annual credit for Capital One Business Travel bookings',isAnnual:true},
      {name:'10,000 Anniversary Miles',details:'10,000 bonus miles each account anniversary',isAnnual:true},
      {name:'Capital One Lounge Access',details:'Access to Capital One Lounges and Priority Pass',isAnnual:false},
      {name:'Global Entry / TSA PreCheck',details:'Up to $100 credit every 4 years',isAnnual:false},
    ]},
  { issuer:'Capital One', cardName:'Venture Business', annualFee:95, colorHex:'#004D40',
    benefits:[
      {category:'travel',multiplier:5,pointType:'Cap One Miles'},
      {category:'hotels',multiplier:5,pointType:'Cap One Miles'},
      {category:'other',multiplier:2,pointType:'Cap One Miles'},
    ],
    perks:[
      {name:'Transfer Partners',details:'Transfer miles to 15+ airline and hotel partners',isAnnual:false},
      {name:'Employee Cards',details:'Free employee cards with no additional fee',isAnnual:false},
    ]},
  { issuer:'Capital One', cardName:'Spark Cash Plus', annualFee:150, colorHex:'#37474F',
    benefits:[
      {category:'other',multiplier:2,pointType:'Cash Back'},
    ],
    perks:[
      {name:'2% Unlimited Cash Back',details:'Flat 2% cash back on every purchase with no cap',isAnnual:false},
      {name:'$200 Cash Bonus',details:'$200 bonus each year you spend $200,000+',isAnnual:true},
      {name:'Charge Card',details:'No preset spending limit — pay in full each month',isAnnual:false},
    ]},
  { issuer:'Capital One', cardName:'Spark Cash Select', annualFee:0, colorHex:'#2E7D32',
    benefits:[
      {category:'other',multiplier:1.5,pointType:'Cash Back'},
    ],
    perks:[
      {name:'1.5% Unlimited Cash Back',details:'Flat 1.5% cash back on every purchase',isAnnual:false},
      {name:'Employee Cards',details:'Free employee cards with no additional fee',isAnnual:false},
    ]},

  // ═══ WELLS FARGO (bonus) ═══
  { issuer:'Wells Fargo', cardName:'Autograph', annualFee:0, colorHex:'#C62828',
    benefits:[
      {category:'dining',multiplier:3,pointType:'WF Rewards'},
      {category:'travel',multiplier:3,pointType:'WF Rewards'},
      {category:'gas',multiplier:3,pointType:'WF Rewards'},
      {category:'transit',multiplier:3,pointType:'WF Rewards'},
      {category:'streaming',multiplier:3,pointType:'WF Rewards'},
      {category:'entertainment',multiplier:3,pointType:'WF Rewards'},
      {category:'other',multiplier:1,pointType:'WF Rewards'},
    ],
    perks:[
      {name:'Cell Phone Protection',details:'Up to $600 per claim for damage/theft',isAnnual:false},
    ]},
  { issuer:'Wells Fargo', cardName:'Active Cash', annualFee:0, colorHex:'#AD1457',
    benefits:[
      {category:'other',multiplier:2,pointType:'Cash Back'},
    ],
    perks:[
      {name:'2% Everywhere',details:'Flat 2% cash back on all purchases',isAnnual:false},
      {name:'0% Intro APR',details:'0% intro APR for 15 months on purchases and balance transfers',isAnnual:false},
    ]},

  { issuer:'Wells Fargo', cardName:'Signify Business Cash', annualFee:0, colorHex:'#880E4F',
    benefits:[
      {category:'other',multiplier:2,pointType:'Cash Back'},
    ],
    perks:[
      {name:'2% Unlimited Cash Back',details:'Flat 2% cash back on every business purchase',isAnnual:false},
      {name:'$1,000 Bonus',details:'$1,000 cash back after spending $15,000 in first 3 months',isAnnual:false},
      {name:'Employee Cards',details:'Free employee cards with no additional fee',isAnnual:false},
    ]},

  // ═══ BILT (bonus) ═══
  { issuer:'Bilt', cardName:'Mastercard', annualFee:0, colorHex:'#37474F',
    benefits:[
      {category:'dining',multiplier:3,pointType:'Bilt Points'},
      {category:'travel',multiplier:2,pointType:'Bilt Points'},
      {category:'other',multiplier:1,pointType:'Bilt Points'},
    ],
    perks:[
      {name:'Pay Rent with No Fee',details:'Earn points on rent payments with no transaction fee',isAnnual:false},
      {name:'Transfer Partners',details:'Transfer to Hyatt, AA, United, Air Canada, and more',isAnnual:false},
      {name:'Rent Day Bonus',details:'Double points on the 1st of each month',isAnnual:false},
    ]},
];

// ── Data Layer ──
const Store = {
  _key: 'cardtracker_cards',
  getAll() { try { return JSON.parse(localStorage.getItem(this._key)) || []; } catch { return []; } },
  save(cards) { localStorage.setItem(this._key, JSON.stringify(cards)); },
  add(card) { const cards = this.getAll(); card.id = crypto.randomUUID(); cards.push(card); this.save(cards); return card; },
  update(card) { const cards = this.getAll(); const i = cards.findIndex(c => c.id === card.id); if (i >= 0) { cards[i] = card; this.save(cards); } },
  remove(id) { this.save(this.getAll().filter(c => c.id !== id)); },
  active() { return this.getAll().filter(c => c.isActive !== false); },
};

// ── Helpers ──
function daysBetween(a, b) { return Math.ceil((new Date(b) - new Date(a)) / 86400000); }
function fmtDate(d) { return d ? new Date(d).toLocaleDateString('en-US', { month:'short', year:'numeric' }) : ''; }
function fmtDateFull(d) { return d ? new Date(d).toLocaleDateString('en-US', { month:'short', day:'numeric', year:'numeric' }) : ''; }
function getMult(card, cat) { const b = (card.benefits||[]).find(x => x.category === cat); return b ? b.multiplier : 1; }
function esc(s) { const d = document.createElement('div'); d.textContent = s || ''; return d.innerHTML; }

function bestCardFor(cat, owner) {
  let pool = Store.active();
  if (owner) pool = pool.filter(c => c.owner === owner);
  return pool.length ? pool.reduce((a, b) => getMult(b, cat) > getMult(a, cat) ? b : a) : null;
}
function rankedCards(cat, owner) {
  let pool = Store.active();
  if (owner) pool = pool.filter(c => c.owner === owner);
  return pool.map(c => ({ card: c, mult: getMult(c, cat) })).sort((a, b) => b.mult - a.mult);
}
function bonusInfo(card) {
  const b = card.signupBonus;
  if (!b || !b.spendRequired) return null;
  const progress = Math.min((b.currentSpend || 0) / b.spendRequired, 1);
  const isComplete = (b.currentSpend || 0) >= b.spendRequired;
  const daysLeft = daysBetween(new Date(), b.spendDeadline);
  const remaining = Math.max(b.spendRequired - (b.currentSpend || 0), 0);
  return { progress, isComplete, daysLeft, remaining, ...b };
}

// ── State ──
let tab = 'cards', cardFilter = 'all', search = '', selCat = 'dining', bestOwner = '', detailId = null;
const app = document.getElementById('app');

function render() {
  let h = detailId ? renderDetail() : (tab === 'cards' ? renderCards() : tab === 'best' ? renderBest() : renderBonus());
  h += renderTabs();
  app.innerHTML = h;
  bindEvents();
}

function renderTabs() {
  return `<nav class="tab-bar">
    <button class="tab-btn ${tab==='cards'?'active':''}" data-tab="cards"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>Cards</button>
    <button class="tab-btn ${tab==='best'?'active':''}" data-tab="best"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>Best Card</button>
    <button class="tab-btn ${tab==='bonus'?'active':''}" data-tab="bonus"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/></svg>Bonuses</button>
  </nav>`;
}

// ── Cards Tab ──
function renderCards() {
  const all = Store.active(), fees = all.reduce((s, c) => s + (c.annualFee||0), 0);
  let list = all;
  if (cardFilter !== 'all') list = list.filter(c => c.owner === cardFilter);
  if (search) { const q = search.toLowerCase(); list = list.filter(c => (c.issuer+' '+c.cardName).toLowerCase().includes(q)); }
  list.sort((a, b) => new Date(b.openDate) - new Date(a.openDate));

  let h = `<div class="page active"><h1 class="page-title">My Cards</h1>
    <div class="summary-strip">
      <div class="summary-item"><div class="value">${all.length}</div><div class="label">Active Cards</div></div>
      <div class="summary-item"><div class="value" style="color:var(--orange)">$${Math.round(fees)}</div><div class="label">Annual Fees</div></div>
    </div>
    <div class="filter-bar">
      <button class="filter-chip ${cardFilter==='all'?'active':''}" data-filter="all">All</button>
      <button class="filter-chip ${cardFilter==='me'?'active':''}" data-filter="me">Me</button>
      <button class="filter-chip ${cardFilter==='spouse'?'active':''}" data-filter="spouse">Spouse</button>
    </div>
    <input class="search-box" type="text" placeholder="Search cards..." value="${esc(search)}" id="search-input">`;

  if (!list.length && !all.length) {
    h += `<div class="empty-state"><div class="icon">💳</div><h3>No Cards Yet</h3><p>Add your first credit card — all benefits are pre-loaded!</p><button onclick="openAddCard()">Add Card</button></div>`;
  } else if (!list.length) {
    h += `<div class="empty-state"><p>No cards match your filter.</p></div>`;
  } else {
    list.forEach(c => {
      const bp = bonusInfo(c); let ring = '';
      if (bp && !bp.isComplete && bp.daysLeft >= 0) { const circ = 2*Math.PI*13, off = circ*(1-bp.progress); ring = `<svg class="progress-ring" viewBox="0 0 32 32"><circle class="bg"/><circle class="fg" stroke-dasharray="${circ}" stroke-dashoffset="${off}"/><text x="16" y="16">${Math.round(bp.progress*100)}%</text></svg>`; }
      h += `<div class="card-row" data-detail="${c.id}"><div class="mini-card" style="background:${esc(c.colorHex)}">${esc((c.issuer||'').substring(0,2).toUpperCase())}</div>
        <div class="info"><div class="name">${esc(c.issuer)} ${esc(c.cardName)}</div><div class="meta"><span class="owner-tag">${c.owner==='me'?'Me':'Spouse'}</span>${c.annualFee?`<span>$${Math.round(c.annualFee)}/yr</span>`:''}${c.lastFourDigits?`<span>•••• ${esc(c.lastFourDigits)}</span>`:''}</div></div>${ring}</div>`;
    });
  }
  h += `<div style="height:20px"></div><button class="btn-primary" onclick="openAddCard()">+ Add New Card</button></div>`;
  return h;
}

// ── Best Card Tab ──
function renderBest() {
  let h = `<div class="page active"><h1 class="page-title">Best Card</h1>
    <div class="filter-bar" style="margin-bottom:12px">
      <button class="filter-chip ${bestOwner===''?'active':''}" data-bestowner="">Both</button>
      <button class="filter-chip ${bestOwner==='me'?'active':''}" data-bestowner="me">Me</button>
      <button class="filter-chip ${bestOwner==='spouse'?'active':''}" data-bestowner="spouse">Spouse</button>
    </div><div class="category-grid">`;
  CATEGORIES.forEach(c => { h += `<div class="cat-chip ${selCat===c.id?'active':''}" data-cat="${c.id}"><div class="icon">${c.icon}</div><div class="cat-label">${c.name}</div></div>`; });
  h += `</div>`;
  const best = bestCardFor(selCat, bestOwner || undefined);
  if (best) {
    const m = getMult(best, selCat), ben = (best.benefits||[]).find(b => b.category === selCat), pt = ben?ben.pointType:'', bp = bonusInfo(best);
    h += `<div class="best-card-result" style="background:linear-gradient(135deg,${esc(best.colorHex)},${esc(best.colorHex)}cc)"><div class="top-row"><div class="card-info"><div class="name">${esc(best.issuer)} ${esc(best.cardName)}</div><span style="background:rgba(255,255,255,0.2);color:#fff;display:inline-block;margin-top:4px;font-size:11px;padding:2px 8px;border-radius:10px">${best.owner==='me'?'Me':'Spouse'}</span></div><div style="text-align:right"><div class="multiplier">${m.toFixed(1)}x</div>${pt?`<div class="pt-type">${esc(pt)}</div>`:''}</div></div>`;
    if (bp && !bp.isComplete && bp.daysLeft >= 0) h += `<div class="bonus-nudge">⭐ Needs $${Math.round(bp.remaining)} more to hit signup bonus!</div>`;
    h += `</div>`;
  } else { h += `<div class="empty-state"><div class="icon">💳</div><h3>No Cards</h3><p>Add cards to get recommendations.</p></div>`; }
  const ranked = rankedCards(selCat, bestOwner || undefined);
  if (ranked.length) { h += `<div class="detail-section"><h3>All Cards Ranked</h3>`; ranked.forEach((r, i) => { h += `<div class="rank-row"><div class="rank-num">#${i+1}</div><div class="rank-mini" style="background:${esc(r.card.colorHex)}"></div><div class="rank-info"><div class="name">${esc(r.card.issuer)} ${esc(r.card.cardName)}</div><div class="owner">${r.card.owner==='me'?'Me':'Spouse'}</div></div><div class="rank-mult">${r.mult.toFixed(1)}x</div></div>`; }); h += `</div>`; }
  h += `</div>`; return h;
}

// ── Bonus Tab ──
function renderBonus() {
  const all = Store.active(), urgent = [], prog = [], done = [];
  all.forEach(c => { const b = bonusInfo(c); if (!b) return; if (b.isComplete) done.push(c); else if (b.daysLeft >= 0 && b.daysLeft <= 30) urgent.push(c); else if (b.daysLeft > 30) prog.push(c); });
  urgent.sort((a, b) => bonusInfo(a).daysLeft - bonusInfo(b).daysLeft);
  prog.sort((a, b) => bonusInfo(a).daysLeft - bonusInfo(b).daysLeft);
  let h = `<div class="page active"><h1 class="page-title">Bonus Tracker</h1>`;
  if (!urgent.length && !prog.length && !done.length) h += `<div class="empty-state"><div class="icon">🎯</div><h3>No Signup Bonuses</h3><p>Cards with signup bonuses will appear here.</p></div>`;
  if (urgent.length) { h += `<div class="bonus-section-title urgent">⚠️ Urgent — Under 30 Days</div>`; urgent.forEach(c => { h += renderBonusCard(c, true); }); }
  if (prog.length) { h += `<div class="bonus-section-title progress">🕐 In Progress</div>`; prog.forEach(c => { h += renderBonusCard(c, false); }); }
  if (done.length) { h += `<div class="bonus-section-title done">✅ Completed</div>`; done.forEach(c => { const b = bonusInfo(c); h += `<div class="completed-row"><div>✅</div><div class="info"><div class="name">${esc(c.issuer)} ${esc(c.cardName)}</div><div class="desc">${esc(b.bonusDescription)}</div></div><span style="font-size:11px;color:var(--text3)">${c.owner==='me'?'Me':'Spouse'}</span></div>`; }); }
  h += `</div>`; return h;
}
function renderBonusCard(c, urg) {
  const b = bonusInfo(c); if (!b) return '';
  const daily = b.daysLeft > 0 ? Math.round(b.remaining / b.daysLeft) : 0, pct = Math.round(b.progress * 100);
  return `<div class="bonus-card"><div class="bonus-card-header"><div class="mini-card" style="background:${esc(c.colorHex)}">${esc((c.issuer||'').substring(0,2).toUpperCase())}</div><div class="info"><div class="name">${esc(c.issuer)} ${esc(c.cardName)}</div><div class="owner">${c.owner==='me'?'Me':'Spouse'}</div></div><div class="days"><div class="num" style="color:${urg?'var(--red)':'var(--text)'}">${b.daysLeft}</div><div class="lbl">days left</div></div></div><div class="bonus-desc">${esc(b.bonusDescription)}</div><div class="progress-bar"><div class="fill" style="width:${pct}%;background:${urg?'var(--red)':'var(--blue)'}"></div></div><div class="bonus-stats"><span>$${Math.round(b.currentSpend||0)} / $${Math.round(b.spendRequired)}</span><span style="font-weight:600;color:${urg?'var(--red)':'var(--text2)'}">$${Math.round(b.remaining)} to go</span></div>${b.daysLeft > 0 ? `<div class="bonus-daily">ℹ️ Spend ~$${daily}/day to hit the target</div>` : ''}<button class="bonus-update-btn ${urg?'urgent':''}" data-updatespend="${c.id}">Update Spend</button></div>`;
}

// ── Detail Page ──
function renderDetail() {
  const c = Store.getAll().find(x => x.id === detailId);
  if (!c) { detailId = null; return renderCards(); }
  const bp = bonusInfo(c);
  let h = `<div class="page active"><button class="detail-back" onclick="closeDetail()">← Back</button>
    <div class="card-visual" style="background:linear-gradient(135deg,${esc(c.colorHex)},${esc(c.colorHex)}cc)"><div class="card-visual-header"><span class="issuer">${esc(c.issuer)}</span><span class="owner-badge">${c.owner==='me'?'Me':'Spouse'}</span></div><div class="card-name">${esc(c.cardName)}</div><div class="card-visual-footer"><span class="digits">•••• •••• •••• ${esc(c.lastFourDigits||'····')}</span>${c.annualFee?`<span class="fee">$${Math.round(c.annualFee)}/yr</span>`:''}</div></div>
    <div style="display:flex;background:var(--surface);border-radius:var(--radius);padding:12px;margin-bottom:12px;text-align:center"><div style="flex:1"><div style="font-weight:700">${fmtDate(c.openDate)}</div><div style="font-size:11px;color:var(--text3)">Opened</div></div><div style="width:1px;background:var(--border)"></div><div style="flex:1"><div style="font-weight:700">${(c.benefits||[]).length}</div><div style="font-size:11px;color:var(--text3)">Benefits</div></div><div style="width:1px;background:var(--border)"></div><div style="flex:1"><div style="font-weight:700">${(c.perks||[]).length}</div><div style="font-size:11px;color:var(--text3)">Perks</div></div></div>`;
  if (bp) { const pct = Math.round(bp.progress*100); h += `<div class="detail-section"><h3>Signup Bonus</h3><div style="font-weight:700;font-size:16px;margin-bottom:8px">${esc(bp.bonusDescription)}</div><div class="progress-bar"><div class="fill" style="width:${pct}%;background:${bp.isComplete?'var(--green)':'var(--blue)'}"></div></div><div style="display:flex;justify-content:space-between;font-size:13px;margin-top:4px"><span>$${Math.round(bp.currentSpend||0)} / $${Math.round(bp.spendRequired)}</span><span style="font-weight:600">${pct}%</span></div>${bp.isComplete?`<div style="margin-top:8px;color:var(--green);font-weight:600">✅ Bonus earned!</div>`:`<div style="display:flex;justify-content:space-between;font-size:12px;color:var(--text3);margin-top:8px"><span style="color:${bp.daysLeft<=30?'var(--red)':'var(--text3)'}">${bp.daysLeft} days left</span><span style="font-weight:600">$${Math.round(bp.remaining)} to go</span></div>`}</div>`; }
  h += `<div class="detail-section"><h3>Earning Rates</h3>`;
  if (!(c.benefits||[]).length) h += `<div style="color:var(--text3);font-size:14px">No earning rates added</div>`;
  else (c.benefits||[]).forEach(b => { const cat = CATEGORIES.find(x => x.id === b.category); h += `<div class="benefit-row"><div class="cat">${cat?cat.icon:'💳'} <span>${cat?cat.name:b.category}</span></div><div><span class="mult">${b.multiplier.toFixed(1)}x</span>${b.pointType?`<span class="pt">${esc(b.pointType)}</span>`:''}</div></div>`; });
  h += `</div><div class="detail-section"><h3>Perks & Credits</h3>`;
  if (!(c.perks||[]).length) h += `<div style="color:var(--text3);font-size:14px">No perks added</div>`;
  else (c.perks||[]).forEach(p => { h += `<div class="perk-row"><div><div class="perk-name">${esc(p.name)}</div>${p.details?`<div class="perk-detail">${esc(p.details)}</div>`:''}</div>${p.isAnnual?'<span class="annual-tag">Annual</span>':''}</div>`; });
  h += `</div><div class="detail-section"><h3>Details</h3><div class="detail-row"><span>Issuer</span><span>${esc(c.issuer)}</span></div><div class="detail-row"><span>Opened</span><span>${fmtDateFull(c.openDate)}</span></div><div class="detail-row"><span>Annual Fee</span><span>$${Math.round(c.annualFee||0)}</span></div>${c.notes?`<div style="margin-top:8px"><div style="font-size:12px;color:var(--text3);margin-bottom:4px">Notes</div><div style="font-size:14px">${esc(c.notes)}</div></div>`:''}</div>`;
  h += `<button class="btn-primary" onclick="openEditCard('${c.id}')">Edit Card</button><button class="btn-danger" onclick="closeCard('${c.id}')">Close Card</button></div>`;
  return h;
}
function closeDetail() { detailId = null; render(); }

// ── Add/Edit Card Modal (with Preset Picker) ──
function openAddCard() { showCardModal(null); }
function openEditCard(id) { const c = Store.getAll().find(x => x.id === id); if (c) showCardModal(c); }

function showCardModal(card) {
  const isEdit = !!card;
  const c = card || { owner:'me', issuer:'', cardName:'', lastFourDigits:'', annualFee:0, openDate:new Date().toISOString().split('T')[0], colorHex:'#1E3A5F', notes:'', benefits:[], perks:[], signupBonus:null, isActive:true };
  window._tb = [...(c.benefits||[])];
  window._tp = [...(c.perks||[])];
  const hasBonus = !!c.signupBonus, bonus = c.signupBonus || {};

  const ov = document.createElement('div');
  ov.className = 'modal-overlay'; ov.id = 'card-modal';

  const colorsH = COLORS.map(hex => `<div class="color-swatch ${c.colorHex===hex?'active':''}" data-color="${hex}" style="background:${hex}"></div>`).join('');
  const catsH = CATEGORIES.map(cat => `<option value="${cat.id}">${cat.icon} ${cat.name}</option>`).join('');

  // Build preset picker grouped by issuer
  const issuers = [...new Set(PRESETS.map(p => p.issuer))];
  let presetHtml = '';
  if (!isEdit) {
    presetHtml = `<div class="form-group"><label>Choose a Card (benefits auto-filled)</label>
      <input class="search-box" type="text" placeholder="Search cards..." id="preset-search" style="margin-bottom:8px">
      <div id="preset-list" style="max-height:240px;overflow-y:auto;border:1px solid var(--border);border-radius:var(--radius-sm);background:var(--surface)">`;
    issuers.forEach(iss => {
      const cards = PRESETS.filter(p => p.issuer === iss);
      presetHtml += `<div style="padding:6px 10px;font-size:11px;color:var(--text3);text-transform:uppercase;letter-spacing:0.5px;background:var(--surface2);font-weight:600">${esc(iss)}</div>`;
      cards.forEach((p, idx) => {
        const globalIdx = PRESETS.indexOf(p);
        presetHtml += `<div class="preset-row" data-preset="${globalIdx}" style="display:flex;align-items:center;gap:10px;padding:10px 12px;cursor:pointer;border-bottom:1px solid rgba(71,85,105,0.2)">
          <div style="width:36px;height:22px;border-radius:3px;background:${p.colorHex};display:flex;align-items:center;justify-content:center;font-size:8px;font-weight:700;color:#fff;flex-shrink:0">${esc(p.issuer.substring(0,2).toUpperCase())}</div>
          <div style="flex:1"><div style="font-size:14px;font-weight:500">${esc(p.issuer)} ${esc(p.cardName)}</div><div style="font-size:11px;color:var(--text3)">${p.annualFee?'$'+p.annualFee+'/yr':'No annual fee'} · ${p.benefits.length} earning rates · ${p.perks.length} perks</div></div>
        </div>`;
      });
    });
    presetHtml += `</div><div style="text-align:center;padding:8px;font-size:12px;color:var(--text3)">Or fill in manually below</div></div>`;
  }

  ov.innerHTML = `<div class="modal">
    <div class="modal-header"><button onclick="closeModal()">Cancel</button><h2>${isEdit?'Edit Card':'Add Card'}</h2><button id="save-btn" style="font-weight:700">${isEdit?'Save':'Add'}</button></div>
    ${presetHtml}
    <div class="form-group"><label>Owner</label><select id="f-owner"><option value="me" ${c.owner==='me'?'selected':''}>Me</option><option value="spouse" ${c.owner==='spouse'?'selected':''}>Spouse</option></select></div>
    <div class="form-row"><div class="form-group"><label>Issuer</label><input id="f-issuer" placeholder="Chase, Amex..." value="${esc(c.issuer)}"></div><div class="form-group"><label>Card Name</label><input id="f-name" placeholder="Sapphire Preferred..." value="${esc(c.cardName)}"></div></div>
    <div class="form-row"><div class="form-group"><label>Last 4 Digits</label><input id="f-last4" maxlength="4" inputmode="numeric" placeholder="1234" value="${esc(c.lastFourDigits||'')}"></div><div class="form-group"><label>Annual Fee ($)</label><input id="f-fee" inputmode="decimal" placeholder="0" value="${c.annualFee||''}"></div></div>
    <div class="form-group"><label>Date Opened</label><input id="f-date" type="date" value="${(c.openDate||'').substring(0,10)}"></div>
    <div class="form-group"><label>Card Color</label><div class="color-grid" id="color-grid">${colorsH}</div></div>
    <div class="form-group"><label>Earning Rates</label><div id="ben-list"></div><button class="add-inline-btn" id="add-ben-btn">+ Add Earning Rate</button></div>
    <div id="ben-form" style="display:none;background:var(--surface);border-radius:var(--radius-sm);padding:12px;margin-bottom:12px">
      <div class="form-row"><div class="form-group"><label>Category</label><select id="bf-cat">${catsH}</select></div><div class="form-group"><label>Multiplier</label><input id="bf-mult" inputmode="decimal" placeholder="3" value="3"></div></div>
      <div class="form-group"><label>Point Type</label><input id="bf-pt" placeholder="Chase UR, Amex MR..."></div>
      <div style="display:flex;gap:8px"><button class="btn-primary" style="flex:1;padding:8px;font-size:13px" id="bf-save">Add</button><button class="btn-danger" style="flex:1;padding:8px;font-size:13px;margin-top:8px" id="bf-cancel">Cancel</button></div>
    </div>
    <div class="form-group"><label>Perks & Credits</label><div id="perk-list"></div><button class="add-inline-btn" id="add-perk-btn">+ Add Perk</button></div>
    <div id="perk-form" style="display:none;background:var(--surface);border-radius:var(--radius-sm);padding:12px;margin-bottom:12px">
      <div class="form-group"><label>Perk Name</label><input id="pf-name" placeholder="Lounge Access..."></div>
      <div class="form-group"><label>Details</label><input id="pf-detail" placeholder="Optional details"></div>
      <div class="toggle-row"><label>Resets Annually</label><button class="toggle on" id="pf-annual"></button></div>
      <div style="display:flex;gap:8px;margin-top:8px"><button class="btn-primary" style="flex:1;padding:8px;font-size:13px" id="pf-save">Add</button><button class="btn-danger" style="flex:1;padding:8px;font-size:13px;margin-top:8px" id="pf-cancel">Cancel</button></div>
    </div>
    <div class="form-group"><div class="toggle-row"><label>Signup Bonus</label><button class="toggle ${hasBonus?'on':''}" id="bonus-toggle"></button></div></div>
    <div id="bonus-fields" style="display:${hasBonus?'block':'none'}">
      <div class="form-group"><label>Bonus Description</label><input id="f-bdesc" placeholder="80,000 UR points" value="${esc(bonus.bonusDescription||'')}"></div>
      <div class="form-row"><div class="form-group"><label>Spend Required ($)</label><input id="f-bspend" inputmode="decimal" placeholder="4000" value="${bonus.spendRequired||''}"></div><div class="form-group"><label>Deadline (months)</label><select id="f-bmonths"><option value="3">3 months</option><option value="6">6 months</option><option value="12">12 months</option><option value="15">15 months</option></select></div></div>
      <div class="form-group"><label>Current Spend ($)</label><input id="f-bcurr" inputmode="decimal" placeholder="0" value="${bonus.currentSpend||''}"></div>
    </div>
    <div class="form-group"><label>Notes</label><textarea id="f-notes" placeholder="Any additional notes...">${esc(c.notes||'')}</textarea></div>
    <button class="btn-primary" id="save-btn2">${isEdit?'Save Card':'Add Card'}</button>
    ${isEdit?`<button class="btn-danger" onclick="closeCard('${c.id}')">Close Card</button>`:''}
  </div>`;

  document.body.appendChild(ov);
  renderBenList(); renderPerkList();

  // ── Preset picker logic ──
  if (!isEdit) {
    // Search filter for presets
    const psearch = document.getElementById('preset-search');
    if (psearch) {
      psearch.addEventListener('input', () => {
        const q = psearch.value.toLowerCase();
        document.querySelectorAll('.preset-row').forEach(row => {
          const txt = row.textContent.toLowerCase();
          row.style.display = txt.includes(q) ? '' : 'none';
        });
      });
    }
    // Click to fill
    document.querySelectorAll('.preset-row').forEach(row => {
      row.addEventListener('click', () => {
        const p = PRESETS[parseInt(row.dataset.preset)];
        if (!p) return;
        document.getElementById('f-issuer').value = p.issuer;
        document.getElementById('f-name').value = p.cardName;
        document.getElementById('f-fee').value = p.annualFee || '';
        // Set color
        document.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('active'));
        const match = document.querySelector(`.color-swatch[data-color="${p.colorHex}"]`);
        if (match) match.classList.add('active');
        // Fill benefits and perks
        window._tb = p.benefits.map(b => ({...b}));
        window._tp = p.perks.map(pk => ({...pk}));
        renderBenList(); renderPerkList();
        // Highlight selected row
        document.querySelectorAll('.preset-row').forEach(r => r.style.background = '');
        row.style.background = 'var(--blue-dim)';
        // Scroll down to show the filled form
        row.scrollIntoView({ behavior: 'smooth', block: 'center' });
      });
    });
  }

  // ── Form event handlers ──
  document.getElementById('color-grid').addEventListener('click', e => { const s = e.target.closest('.color-swatch'); if (!s) return; document.querySelectorAll('.color-swatch').forEach(x => x.classList.remove('active')); s.classList.add('active'); });
  document.getElementById('add-ben-btn').addEventListener('click', () => { document.getElementById('ben-form').style.display = 'block'; });
  document.getElementById('bf-cancel').addEventListener('click', () => { document.getElementById('ben-form').style.display = 'none'; });
  document.getElementById('bf-save').addEventListener('click', () => {
    window._tb.push({ category: document.getElementById('bf-cat').value, multiplier: parseFloat(document.getElementById('bf-mult').value)||1, pointType: document.getElementById('bf-pt').value });
    document.getElementById('ben-form').style.display = 'none'; document.getElementById('bf-mult').value = '3'; document.getElementById('bf-pt').value = ''; renderBenList();
  });
  document.getElementById('add-perk-btn').addEventListener('click', () => { document.getElementById('perk-form').style.display = 'block'; });
  document.getElementById('pf-cancel').addEventListener('click', () => { document.getElementById('perk-form').style.display = 'none'; });
  document.getElementById('pf-save').addEventListener('click', () => {
    const n = document.getElementById('pf-name').value; if (!n) return;
    window._tp.push({ name: n, details: document.getElementById('pf-detail').value, isAnnual: document.getElementById('pf-annual').classList.contains('on') });
    document.getElementById('perk-form').style.display = 'none'; document.getElementById('pf-name').value = ''; document.getElementById('pf-detail').value = ''; renderPerkList();
  });
  document.getElementById('pf-annual').addEventListener('click', function() { this.classList.toggle('on'); });
  document.getElementById('bonus-toggle').addEventListener('click', function() { this.classList.toggle('on'); document.getElementById('bonus-fields').style.display = this.classList.contains('on') ? 'block' : 'none'; });

  const save = () => {
    const issuer = document.getElementById('f-issuer').value.trim(), cardName = document.getElementById('f-name').value.trim();
    if (!issuer || !cardName) return;
    const ac = document.querySelector('.color-swatch.active'), od = document.getElementById('f-date').value, hb = document.getElementById('bonus-toggle').classList.contains('on');
    let sb = null;
    if (hb) { const mo = parseInt(document.getElementById('f-bmonths').value)||3, d = new Date(od||Date.now()); d.setMonth(d.getMonth()+mo); sb = { bonusDescription: document.getElementById('f-bdesc').value, spendRequired: parseFloat(document.getElementById('f-bspend').value)||0, spendDeadline: d.toISOString(), currentSpend: parseFloat(document.getElementById('f-bcurr').value)||0 }; }
    const nc = { id: isEdit?c.id:undefined, owner: document.getElementById('f-owner').value, issuer, cardName, lastFourDigits: document.getElementById('f-last4').value.replace(/\D/g,'').substring(0,4), annualFee: parseFloat(document.getElementById('f-fee').value)||0, openDate: od||new Date().toISOString().split('T')[0], colorHex: ac?ac.dataset.color:'#1E3A5F', notes: document.getElementById('f-notes').value, benefits: window._tb, perks: window._tp, signupBonus: sb, isActive: true };
    if (isEdit) Store.update(nc); else Store.add(nc);
    closeModal(); render();
  };
  document.getElementById('save-btn').addEventListener('click', save);
  document.getElementById('save-btn2').addEventListener('click', save);
}

function renderBenList() {
  const el = document.getElementById('ben-list'); if (!el) return;
  el.innerHTML = window._tb.map((b, i) => { const cat = CATEGORIES.find(c => c.id === b.category); return `<div class="inline-list-item"><span>${cat?cat.icon:'💳'} ${cat?cat.name:b.category} — ${b.multiplier}x ${b.pointType?'('+esc(b.pointType)+')':''}</span><button class="remove-btn" data-rmb="${i}">×</button></div>`; }).join('');
  el.querySelectorAll('[data-rmb]').forEach(btn => { btn.addEventListener('click', () => { window._tb.splice(parseInt(btn.dataset.rmb), 1); renderBenList(); }); });
}
function renderPerkList() {
  const el = document.getElementById('perk-list'); if (!el) return;
  el.innerHTML = window._tp.map((p, i) => `<div class="inline-list-item"><span>${esc(p.name)}${p.isAnnual?' (Annual)':''}</span><button class="remove-btn" data-rmp="${i}">×</button></div>`).join('');
  el.querySelectorAll('[data-rmp]').forEach(btn => { btn.addEventListener('click', () => { window._tp.splice(parseInt(btn.dataset.rmp), 1); renderPerkList(); }); });
}
function closeModal() { const m = document.getElementById('card-modal'); if (m) m.remove(); }

// ── Update Spend Modal ──
function openUpdateSpend(id) {
  const card = Store.getAll().find(c => c.id === id);
  if (!card || !card.signupBonus) return;
  const b = card.signupBonus;
  const ov = document.createElement('div');
  ov.className = 'modal-overlay'; ov.id = 'spend-modal';
  ov.innerHTML = `<div class="modal" style="max-height:50dvh">
    <div class="modal-header"><button onclick="document.getElementById('spend-modal').remove()">Cancel</button><h2>Update Spend</h2><button id="save-spend" style="font-weight:700">Save</button></div>
    <div style="font-weight:600;font-size:16px;margin-bottom:12px">${esc(card.issuer)} ${esc(card.cardName)}</div>
    <div class="detail-row"><span>Target</span><span>$${Math.round(b.spendRequired)}</span></div>
    <div class="detail-row"><span>Current</span><span>$${Math.round(b.currentSpend||0)}</span></div>
    <div class="form-group" style="margin-top:16px"><label>New Total Spend ($)</label><input id="new-spend" inputmode="decimal" value="${Math.round(b.currentSpend||0)}"></div>
    <button class="btn-primary" id="save-spend2">Save</button>
  </div>`;
  document.body.appendChild(ov);
  const doSave = () => { card.signupBonus.currentSpend = parseFloat(document.getElementById('new-spend').value)||0; Store.update(card); document.getElementById('spend-modal').remove(); render(); };
  document.getElementById('save-spend').addEventListener('click', doSave);
  document.getElementById('save-spend2').addEventListener('click', doSave);
}

function closeCard(id) {
  if (!confirm('Close this card? It will be marked as inactive.')) return;
  const c = Store.getAll().find(x => x.id === id);
  if (c) { c.isActive = false; Store.update(c); }
  closeModal(); detailId = null; render();
}

// ── Event Binding ──
function bindEvents() {
  document.querySelectorAll('.tab-btn').forEach(b => b.addEventListener('click', () => { tab = b.dataset.tab; detailId = null; render(); }));
  document.querySelectorAll('[data-filter]').forEach(b => b.addEventListener('click', () => { cardFilter = b.dataset.filter; render(); }));
  const si = document.getElementById('search-input');
  if (si) si.addEventListener('input', e => { search = e.target.value; render(); const ni = document.getElementById('search-input'); if (ni) { ni.focus(); ni.selectionStart = ni.selectionEnd = ni.value.length; } });
  document.querySelectorAll('[data-detail]').forEach(el => el.addEventListener('click', () => { detailId = el.dataset.detail; render(); }));
  document.querySelectorAll('[data-cat]').forEach(el => el.addEventListener('click', () => { selCat = el.dataset.cat; render(); }));
  document.querySelectorAll('[data-bestowner]').forEach(el => el.addEventListener('click', () => { bestOwner = el.dataset.bestowner; render(); }));
  document.querySelectorAll('[data-updatespend]').forEach(b => b.addEventListener('click', () => { openUpdateSpend(b.dataset.updatespend); }));
}

// ── Go ──
render();
