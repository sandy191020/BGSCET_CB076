export type Language = 'en' | 'hi' | 'kn' | 'te' | 'mr';

export const languages: { code: Language; label: string; flag: string }[] = [
  { code: 'en', label: 'English', flag: '🇺🇸' },
  { code: 'hi', label: 'हिन्दी', flag: '🇮🇳' },
  { code: 'kn', label: 'ಕನ್ನಡ', flag: '🇮🇳' },
  { code: 'te', label: 'తెలుగు', flag: '🇮🇳' },
  { code: 'mr', label: 'मराठी', flag: '🇮🇳' },
];

export const translations: Record<Language, any> = {
  en: {
    nav: {
      groups: { core: "Core Systems", assets: "Platform Assets" },
      overview: "Overview",
      auction: "Live Auction",
      wallet: "Wallet",
      analytics: "Analytics",
      problem: "Problem",
      how_it_works: "How It Works",
      verify: "Verify",
      market: "Market",
      admin: "Admin",
      signin: "Sign In",
      join: "Join"
    },
    hero: {
      title: "Engineered for Transparency",
      subtitle: "Our multi-layered verification system ensures every carbon credit is backed by scientific reality.",
      start_earning: "Start Earning",
      watch_demo: "Watch Demo"
    },
    features: {
      title: "Engineered for Transparency",
      subtitle: "Our multi-layered verification system ensures every carbon credit is backed by scientific reality.",
      satellite: {
        title: "Satellite Verification",
        desc: "Sentinel-2 satellite imagery verifies farmland conditions and vegetation health using NDVI analysis."
      },
      ai: {
        title: "AI Sustainability Scoring",
        desc: "Mastra AI analyzes vegetation data and automatically scores farm sustainability."
      },
      blockchain: {
        title: "Blockchain Tokenization",
        desc: "Verified carbon reduction is converted into ERC-1155 carbon credit tokens minted on Polygon."
      },
      market: {
        title: "Direct Carbon Marketplace",
        desc: "Companies purchase carbon credits directly from farmers without intermediaries."
      }
    },
    event: {
      upcoming: "Upcoming Event",
      title: "Crops",
      subtitle: "Commencement",
      time: "Time",
      register: "Register for Seat"
    },
    problem: {
      desc: "Traditional supply chains are opaque, inefficient, and penalize sustainable practices. Smallholder farmers lose up to 60% of value to intermediaries while carbon offsets remain unverified.",
      traceability: {
        title: "Opaque Traceability",
        desc: "No way to verify soil health or chemical-free claims."
      },
      middleman: {
        title: "Middleman Tax",
        desc: "Layered commission structures draining farmer revenue."
      },
      greenwash: {
        title: "Greenwashing",
        desc: "Unverified carbon credits being sold as premium offsets."
      }
    },
    dashboard: {
      welcome: "Welcome,",
      market_data: "Market Data",
      active_bids: "Active Bids",
      token_balance: "Token Balance",
      verification_status: "Verification Status",
      recent_activity: "Recent Activity",
      impact: "Your Impact",
      farmer_hub: "Farmer_Hub",
      market_analytics: "Market_Analytics",
      user_role: "Identity_Role",
      status: "Node_Status",
      verified: "VERIFIED",
      unauthorized: "UNAUTHORIZED",
      select_location: "Select Farm Location",
      tap_map: "Tap map to anchor verification node",
      inventory_live: "Inventory_Live",
      receipt: "Last_Transaction_Receipt",
      supply_analysis: "Supply_Analysis",
      supply_desc: "Real-time verification metrics for carbon sequestration across registered farmer nodes.",
      impact_score: "Impact Score",
      offset_volume: "Offset Volume",
      procurement_stats: "Procurement Stats",
      producers: "Active Producers",
      qr_scans: "Verification Scans",
      top_region: "Top Supply Region",
      nav_exchange: "Go to Exchange",
      wallet: "Node Wallet",
      land: "Registered Land",
      network: "Ecosystem Network",
      impact_metric: "Impact Growth"
    },
    footer: {
      terms: "Terms of Service",
      privacy: "Privacy Protocol",
      api: "API Docs",
      copyright: "© 2026 GreenLedger Autonomous Systems"
    },
    admin: {
      title: "Root_Terminal",
      auth_ok: "Admin Authorization: OK",
      tabs: {
        overview: "Market_Summary",
        announcements: "Broadcast_Hub",
        auctions: "Exchange_Control",
        users: "Entity_Registry"
      },
      logs: "Security_Logs",
      stats: {
        velocity: "Network_Velocity",
        entities: "Active_Entities",
        volume: "Exchange_Volume",
        uptime: "Security_Uptime"
      },
      overview: {
        core_status: "Exchange_Core Status",
        integrity: "Platform Operational Integrity",
        optimal: "OPTIMAL",
        live_sessions: "Live Sessions",
        commitment_bids: "Commitment Bids",
        seats_reserved: "Seats Reserved",
        recent_activity: "Recent Activity Hub",
        security_vectors: "Security Vectors",
        live_monitor: "Live Auction Monitor",
        impact_report: "View Impact_Report",
        bid_pulse: "Bid_Node_Pulse: Verified",
        tx_hashed: "Transaction hashed at index",
        waf_guard: "WAF Guard",
        shield_on: "Shield_On",
        ddos_mitigation: "DDoS Mitigation",
        active: "Active",
        live_bidding: "Currently Live & Bidding",
        no_live: "No Active Live Streams_",
        sustainability: "System Sustainability",
        offset_text: "Platform is currently offsetting 14.2 tons of Carbon through verified farmer nodes."
      },
      broadcast: {
        console: "Broadcast Console",
        injection: "Global Notification Injection Interface",
        subject: "Enter Broadcast Subject_",
        signature: "Signature Type",
        payload: "Payload Content",
        finalize: "Finalize_Dispatch",
        sending: "Injecting_Signal...",
        success: "Global Broadcast Dispatched_",
        fail: "Broadcast Fail_",
        footer: "Global signals appear instantly in the top announcement strip and user notification hubs."
      },
      exchange: {
        registry: "Exchange Control Registry",
        initiate: "Initiate_New_Auction",
        cancel: "Cancel_Action",
        title_label: "Auction_Title",
        type_label: "Exchange_Type",
        farmer_label: "Farmer Allocation",
        base_price: "Base_Price",
        scheduled_time: "Scheduled_Time",
        deploy: "Deploy_to_Ecosystem",
        active_tab: "Active & Scheduled",
        history_tab: "History / Settled",
        uid: "Signal_UID",
        entity: "Exchange_Entity",
        status_node: "Status_Node",
        valuation: "Valuation_Floor",
        winner: "Winner_Node",
        close: "Close",
        confirm_delete: "Are you sure? This action cannot be undone.",
        no_records: "No Records Found"
      },
      users: {
        title: "Entity_Directory Encrypted",
        auth_required: "Authorization for Partner_Review required from Central Node"
      }
    }
  },
  hi: {
    nav: {
      groups: { core: "मुख्य सिस्टम", assets: "प्लेटफ़ॉर्म संपत्ति" },
      overview: "अवलोकन",
      auction: "लाइव नीलामी",
      wallet: "वॉलेट",
      analytics: "विश्लेषण",
      problem: "समस्या",
      how_it_works: "यह कैसे काम करता है",
      verify: "सत्यापित करें",
      market: "बाजार",
      admin: "एडमिन",
      signin: "साइन इन करें",
      join: "जुड़ें"
    },
    hero: {
      title: "पारदर्शिता के लिए इंजीनियर",
      subtitle: "हमारा बहु-स्तरीय सत्यापन तंत्र यह सुनिश्चित करता है कि प्रत्येक कार्बन क्रेडिट वैज्ञानिक वास्तविकता पर आधारित हो।",
      start_earning: "कमाना शुरू करें",
      watch_demo: "डेमो देखें"
    },
    features: {
      title: "पारदर्शिता के लिए निर्मित",
      subtitle: "हमारा सत्यापन तंत्र वैज्ञानिक रूप से प्रमाणित है।",
      satellite: {
        title: "सैटेलाइट सत्यापन",
        desc: "NDVI विश्लेषण का उपयोग करके कृषि भूमि की स्थिति और वनस्पति स्वास्थ्य की जांच।"
      },
      ai: {
        title: "AI स्कोरिंग",
        desc: "Mastra AI वनस्पति डेटा का विश्लेषण करता है और स्वचालित रूप से स्थिरता स्कोर देता है।"
      },
      blockchain: {
        title: "ब्लॉकचेन टोकन",
        desc: "सत्यापित कार्बन कटौती को Polygon पर ERC-1155 टोकन में बदला जाता है।"
      },
      market: {
        title: "कार्बन मार्केट",
        desc: "कंपनियां बिना किसी मध्यस्थ के सीधे किसानों से क्रेडिट खरीदती हैं।"
      }
    },
    event: {
      upcoming: "आगामी कार्यक्रम",
      title: "फसल",
      subtitle: "प्रारंभ",
      time: "समय",
      register: "सीट के लिए पंजीकरण करें"
    },
    problem: {
      desc: "पारंपरिक आपूर्ति श्रृंखलाएं अपारदर्शी और अक्षम हैं। छोटे किसानों को नुकसान होता है।",
      traceability: {
        title: "अपारदर्शी पता लगाने की क्षमता",
        desc: "मिट्टी के स्वास्थ्य या रसायन मुक्त दावों को सत्यापित करने का कोई तरीका नहीं।"
      },
      middleman: {
        title: "बिचौलियों का कर",
        desc: "स्तरित कमीशन संरचनाएं किसान के राजस्व को खत्म कर रही हैं।"
      },
      greenwash: {
        title: "ग्रीनवाशिंग",
        desc: "असत्यापित कार्बन क्रेडिट को प्रीमियम के रूप में बेचा जा रहा है।"
      }
    },
    dashboard: {
      welcome: "स्वागत है,",
      market_data: "मार्केट डेटा",
      active_bids: "सक्रिय बोलियां",
      token_balance: "टोकन बैलेंस",
      verification_status: "सत्यापन स्थिति",
      recent_activity: "हाल की गतिविधि",
      impact: "आपका प्रभाव",
      farmer_hub: "किसान_हब",
      market_analytics: "बाजार_विश्लेषण",
      user_role: "पहचान_भूमिका",
      status: "नोड_स्थिति",
      verified: "सत्यापित",
      unauthorized: "अनधिकृत",
      select_location: "खेत का स्थान चुनें",
      tap_map: "सत्यापन नोड को एंकर करने के लिए मैप पर टैप करें",
      inventory_live: "इन्वेंट्री_लाइव",
      receipt: "अंतिम_लेनदेन_रसीद",
      supply_analysis: "आपूर्ति_विश्लेषण",
      supply_desc: "पंजीकृत किसान नोड्स में कार्बन पृथक्करण के लिए वास्तविक समय सत्यापन मेट्रिक्स।",
      impact_score: "प्रभाव स्कोर",
      offset_volume: "ऑफसेट वॉल्यूम",
      procurement_stats: "खरीद आंकड़े",
      producers: "सक्रिय उत्पादक",
      qr_scans: "सत्यापन स्कैन",
      top_region: "शीर्ष आपूर्ति क्षेत्र",
      nav_exchange: "एक्सचेंज पर जाएं",
      wallet: "नोड वॉलेट",
      land: "पंजीकृत भूमि",
      network: "पारिस्थितिकी तंत्र",
      impact_metric: "प्रभाव वृद्धि"
    },
    footer: {
      terms: "सेवा की शर्तें",
      privacy: "गोपनीयता",
      api: "API दस्तावेज़",
      copyright: "© 2026 ग्रीनलेजर ऑटोनॉमस सिस्टम्स"
    },
    admin: {
      title: "रूट_टर्मिनल",
      auth_ok: "एडमिन प्रमाणीकरण: ठीक",
      tabs: {
        overview: "मार्केट_सारांश",
        announcements: "प्रसारण_हब",
        auctions: "एक्सचेंज_नियंत्रण",
        users: "इकाई_रजिस्ट्री"
      },
      logs: "सुरक्षा_लॉग",
      stats: {
        velocity: "नेटवर्क_गति",
        entities: "सक्रिय_इकाइयां",
        volume: "एक्सचेंज_वॉल्यूम",
        uptime: "सुरक्षा_अपटाइम"
      },
      overview: {
        core_status: "एक्सचेंज_कोर स्थिति",
        integrity: "प्लेटफॉर्म परिचालन अखंडता",
        optimal: "इष्टतम",
        live_sessions: "लाइव सत्र",
        commitment_bids: "प्रतिबद्धता बोलियां",
        seats_reserved: "सीटें आरक्षित",
        recent_activity: "हाल की गतिविधि हब",
        security_vectors: "सुरक्षा वेक्टर",
        live_monitor: "लाइव नीलामी मॉनिटर",
        impact_report: "प्रभाव_रिपोर्ट देखें",
        bid_pulse: "बिड_नोड_पल्स: सत्यापित",
        tx_hashed: "इंडेक्स पर ट्रांजेक्शन हैश किया गया",
        waf_guard: "WAF गार्ड",
        shield_on: "शील्ड_ऑन",
        ddos_mitigation: "DDoS न्यूनीकरण",
        active: "सक्रिय",
        live_bidding: "वर्तमान में लाइव और बोली",
        no_live: "कोई सक्रिय लाइव स्ट्रीम नहीं_",
        sustainability: "सिस्टम स्थिरता",
        offset_text: "प्लेटफॉर्म वर्तमान में सत्यापित किसान नोड्स के माध्यम से 14.2 टन कार्बन को ऑफसेट कर रहा है।"
      },
      broadcast: {
        console: "प्रसारण कंसोल",
        injection: "ग्लोबल नोटिफिकेशन इंजेक्शन इंटरफेस",
        subject: "प्रसारण विषय दर्ज करें_",
        signature: "हस्ताक्षर प्रकार",
        payload: "पेलोड सामग्री",
        finalize: "डिस्पैच_अंतिम करें",
        sending: "सिग्नल_इंजेक्ट किया जा रहा है...",
        success: "वैश्विक प्रसारण भेजा गया_",
        fail: "प्रसारण विफल_",
        footer: "वैश्विक सिग्नल तुरंत शीर्ष घोषणा पट्टी और उपयोगकर्ता अधिसूचना केंद्रों में दिखाई देते हैं।"
      },
      exchange: {
        registry: "एक्सचेंज नियंत्रण रजिस्ट्री",
        initiate: "नई_नीलामी_शुरू करें",
        cancel: "कार्रवाई_रद्द करें",
        title_label: "नीलामी_शीर्षक",
        type_label: "एक्सचेंज_प्रकार",
        farmer_label: "किसान आवंटन",
        base_price: "आधार_कीमत",
        scheduled_time: "निर्धारित_समय",
        deploy: "पारिस्थितिकी तंत्र_में_तैनात करें",
        active_tab: "सक्रिय और निर्धारित",
        history_tab: "इतिहास / निपटान",
        uid: "सिग्नल_UID",
        entity: "एक्सचेंज_इकाई",
        status_node: "स्थिति_नोड",
        valuation: "मूल्यांकन_तल",
        winner: "विजेता_नोड",
        close: "बंद करें",
        confirm_delete: "क्या आप निश्चित हैं? यह क्रिया पूर्ववत नहीं की जा सकती।",
        no_records: "कोई रिकॉर्ड नहीं मिला"
      },
      users: {
        title: "इकाई_निर्देशिका एन्क्रिप्टेड",
        auth_required: "सेंट्रल नोड से पार्टनर_समीक्षा के लिए प्राधिकरण आवश्यक है"
      }
    }
  },
  kn: {
    nav: {
      groups: { core: "ಮುಖ್ಯ ವ್ಯವಸ್ಥೆಗಳು", assets: "ಪ್ಲಾಟ್‌ಫಾರ್ಮ್ ಆಸ್ತಿಗಳು" },
      overview: "ಅವಲೋಕನ",
      auction: "ಲೈವ್ ಹರಾಜು",
      wallet: "ವಾಲೆಟ್",
      analytics: "ವಿಶ್ಲೇಷಣೆ",
      problem: "ಸಮಸ್ಯೆ",
      how_it_works: "ಹೇಗೆ ಕೆಲಸ ಮಾಡುತ್ತದೆ",
      verify: "ಪರಿಶೀಲಿಸಿ",
      market: "ಮಾರುಕಟ್ಟೆ",
      admin: "ಅಡ್ಮಿನ್",
      signin: "ಸೈನ್ ಇನ್",
      join: "ಸೇರಿ"
    },
    hero: {
      title: "ಪಾರದರ್ಶಕತೆಗಾಗಿ ವಿನ್ಯಾಸಗೊಳಿಸಲಾಗಿದೆ",
      subtitle: "ನಮ್ಮ ಬಹು-ಪದರದ ಪರಿಶೀಲನಾ ವ್ಯವಸ್ಥೆಯು ಪ್ರತಿ ಕಾರ್ಬನ್ ಕ್ರೆಡಿಟ್ ವೈಜ್ಞಾನಿಕ ವಾಸ್ತವತೆಯಿಂದ ಬೆಂಬಲಿತವಾಗಿದೆ ಎಂದು ಖಚಿತಪಡಿಸುತ್ತದೆ.",
      start_earning: "ಗಳಿಸಲು ಪ್ರಾರಂಭಿಸಿ",
      watch_demo: "ಡೆಮೊ ವೀಕ್ಷಿಸಿ"
    },
    features: {
      title: "ಪಾರದರ್ಶಕತೆಗಾಗಿ ನಿರ್ಮಿಸಲಾಗಿದೆ",
      subtitle: "ನಮ್ಮ ಪರಿಶೀಲನಾ ವ್ಯವಸ್ಥೆಯು ವೈಜ್ಞಾನಿಕವಾಗಿ ಪ್ರಮಾಣೀಕರಿಸಲ್ಪಟ್ಟಿದೆ.",
      satellite: {
        title: "ಉಪಗ್ರಹ ಪರಿಶೀಲನೆ",
        desc: "NDVI ವಿಶ್ಲೇಷಣೆಯನ್ನು ಬಳಸಿಕೊಂಡು ಕೃಷಿ ಭೂಮಿಯ ಸ್ಥಿತಿ ಮತ್ತು ಸಸ್ಯವರ್ಗದ ಆರೋಗ್ಯದ ಪರಿಶೀಲನೆ."
      },
      ai: {
        title: "AI ಸ್ಕೋರಿಂಗ್",
        desc: "Mastra AI ಸಸ್ಯವರ್ಗದ ಡೇಟಾವನ್ನು ವಿಶ್ಲೇಷಿಸುತ್ತದೆ ಮತ್ತು ಸ್ವಯಂಚಾಲಿತವಾಗಿ ಸ್ಥಿರತೆಯ ಸ್ಕೋರ್ ನೀಡುತ್ತದೆ."
      },
      blockchain: {
        title: "ಬ್ಲಾಕ್‌ಚೈನ್ ಟೋಕನ್",
        desc: "ಪರಿಶೀಲಿಸಿದ ಕಾರ್ಬನ್ ಕಡಿತವನ್ನು Polygon ನಲ್ಲಿ ERC-1155 ಟೋಕನ್‌ಗಳಿಗೆ ಬದಲಾಯಿಸಲಾಗುತ್ತದೆ."
      },
      market: {
        title: "ಕಾರ್ಬನ್ ಮಾರುಕಟ್ಟೆ",
        desc: "ಕಂಪನಿಗಳು ಯಾವುದೇ ಮಧ್ಯವರ್ತಿಗಳಿಲ್ಲದೆ ನೇರವಾಗಿ ರೈತರಿಂದ ಕ್ರೆಡಿಟ್‌ಗಳನ್ನು ಖರೀದಿಸುತ್ತವೆ."
      }
    },
    event: {
      upcoming: "ಮುಂಬರುವ ಈವೆಂಟ್",
      title: "ಬೆಳೆ",
      subtitle: "ಪ್ರಾರಂಭ",
      time: "ಸಮಯ",
      register: "ಸೀಟಿಗಾಗಿ ನೋಂದಾಯಿಸಿ"
    },
    problem: {
      desc: "ಸಾಂಪ್ರದಾಯಿಕ ಪೂರೈಕೆ ಸರಪಳಿಗಳು ಅಸ್ಪಷ್ಟ ಮತ್ತು ಅಸಮರ್ಥವಾಗಿವೆ. ಸಣ್ಣ ರೈತರಿಗೆ ನಷ್ಟವಾಗುತ್ತಿದೆ.",
      traceability: {
        title: "ಅಸ್ಪಷ್ಟ ಪತ್ತೆಹಚ್ಚುವಿಕೆ",
        desc: "ಮಣ್ಣಿನ ಆರೋಗ್ಯ ಅಥವಾ ರಾಸಾಯನಿಕ ಮುಕ್ತ ಹಕ್ಕುಗಳನ್ನು ಪರಿಶೀಲಿಸಲು ಯಾವುದೇ ಮಾರ್ಗವಿಲ್ಲ."
      },
      middleman: {
        title: "ಮಧ್ಯವರ್ತಿಗಳ ತೆರಿಗೆ",
        desc: "ಪದರದ ಕಮಿಷನ್ ರಚನೆಗಳು ರೈತರ ಆದಾಯವನ್ನು ಕಡಿಮೆ ಮಾಡುತ್ತಿವೆ."
      },
      greenwash: {
        title: "ಗ್ರೀನ್‌ವಾಶಿಂಗ್",
        desc: "ಪರಿಶೀಲಿಸದ ಕಾರ್ಬನ್ ಕ್ರೆಡಿಟ್‌ಗಳನ್ನು ಪ್ರೀಮಿಯಂ ಆಗಿ ಮಾರಾಟ ಮಾಡಲಾಗುತ್ತಿದೆ."
      }
    },
    dashboard: {
      welcome: "ಸ್ವಾಗತ,",
      market_data: "ಮಾರುಕಟ್ಟೆ ಡೇಟಾ",
      active_bids: "ಸಕ್ರಿಯ ಬಿಡ್‌ಗಳು",
      token_balance: "ಟೋಕನ್ ಬ್ಯಾಲೆನ್ಸ್",
      verification_status: "ಪರಿಶೀಲನಾ ಸ್ಥಿತಿ",
      recent_activity: "ಇತ್ತೀಚಿನ ಚಟುವಟಿಕೆ",
      impact: "ನಿಮ್ಮ ಪ್ರಭಾವ",
      farmer_hub: "ರೈತ_ಹಬ್",
      market_analytics: "ಮಾರುಕಟ್ಟೆ_ವಿಶ್ಲೇಷಣೆ",
      user_role: "ಗುರುತಿನ_ಪಾತ್ರ",
      status: "ನೋಡ್_ಸ್ಥಿತಿ",
      verified: "ಪರಿಶೀಲಿಸಲಾಗಿದೆ",
      unauthorized: "ಅನಧಿಕೃತ",
      select_location: "ಫಾರ್ಮ್ ಸ್ಥಳವನ್ನು ಆರಿಸಿ",
      tap_map: "ಪರಿಶೀಲನಾ ನೋಡ್ ಅನ್ನು ಆಂಕರ್ ಮಾಡಲು ಮ್ಯಾಪ್ ಮೇಲೆ ಟ್ಯಾಪ್ ಮಾಡಿ",
      inventory_live: "ದಾಸ್ತಾನು_ಲೈವ್",
      receipt: "ಕೊನೆಯ_ವ್ಯವಹಾರ_ರಸೀದಿ",
      supply_analysis: "ಪೂರೈಕೆ_ವಿಶ್ಲೇಷಣೆ",
      supply_desc: "ನೋಂದಾಯಿತ ರೈತ ನೋಡ್‌ಗಳಲ್ಲಿ ಕಾರ್ಬನ್ ಬೇರ್ಪಡಿಸುವಿಕೆಗಾಗಿ ನೈಜ-ಸಮಯದ ಪರಿಶೀಲನಾ ಮೆಟ್ರಿಕ್ಸ್.",
      impact_score: "ಪರಿಣಾಮದ ಸ್ಕೋರ್",
      offset_volume: "ಆಫ್‌ಸೆಟ್ ವಾಲ್ಯೂಮ್",
      procurement_stats: "ಖರೀದಿ ಅಂಕಿಅಂಶಗಳು",
      producers: "ಸಕ್ರಿಯ ಉತ್ಪಾದಕರು",
      qr_scans: "ಪರಿಶೀಲನಾ ಸ್ಕ್ಯಾನ್‌ಗಳು",
      top_region: "ಉನ್ನತ ಪೂರೈಕೆ ಪ್ರದೇಶ",
      nav_exchange: "ವಿನಿಮಯಕ್ಕೆ ಹೋಗಿ",
      wallet: "ನೋಡ್ ವಾಲೆಟ್",
      land: "ನೋಂದಾಯಿತ ಭೂಮಿ",
      network: "ಪರಿಸರ ವ್ಯವಸ್ಥೆ",
      impact_metric: "ಪರಿಣಾಮದ ಬೆಳವಣಿಗೆ"
    },
    footer: {
      terms: "ಸೇವಾ ನಿಯಮಗಳು",
      privacy: "ಗೌಪ್ಯತೆ",
      api: "API ದಾಖಲೆಗಳು",
      copyright: "© 2026 ಗ್ರೀನ್‌ಲೆಡ್ಜರ್ ಅಟೋನೊಮಸ್ ಸಿಸ್ಟಮ್ಸ್"
    },
    admin: {
      title: "ರೂಟ್_ಟರ್ಮಿನಲ್",
      auth_ok: "ಅಡ್ಮಿನ್ ದೃಢೀಕರಣ: ಸರಿ",
      tabs: {
        overview: "ಮಾರುಕಟ್ಟೆ_ಸಾರಾಂಶ",
        announcements: "ಪ್ರಸಾರ_ಹಬ್",
        auctions: "ವಿನಿಮಯ_ನಿಯಂತ್ರಣ",
        users: "ಅಸ್ತಿತ್ವ_ನೋಂದಣಿ"
      },
      logs: "ಭದ್ರತಾ_ಲಾಗ್‌ಗಳು",
      stats: {
        velocity: "ನೆಟ್‌ವರ್ಕ್_ವೇಗ",
        entities: "ಸಕ್ರಿಯ_ಅಸ್ತಿತ್ವಗಳು",
        volume: "ವಿನಿಮಯ_ಪರಿಮಾಣ",
        uptime: "ಭದ್ರತಾ_ಅಪ್‌ಟೈಮ್"
      },
      overview: {
        core_status: "ವಿನಿಮಯ_ಕೋರ್ ಸ್ಥಿತಿ",
        integrity: "ಪ್ಲಾಟ್‌ಫಾರ್ಮ್ ಕಾರ್ಯಾಚರಣೆಯ ಸಮಗ್ರತೆ",
        optimal: "ಅತ್ಯುತ್ತಮ",
        live_sessions: "ಲೈವ್ ಸೆಷನ್ಗಳು",
        commitment_bids: "ಬದ್ಧತೆಯ ಬಿಡ್‌ಗಳು",
        seats_reserved: "ಸ್ಥಳಗಳು ಕಾಯ್ದಿರಿಸಲಾಗಿದೆ",
        recent_activity: "ಇತ್ತೀಚಿನ ಚಟುವಟಿಕೆ ಹಬ್",
        security_vectors: "ಭದ್ರತಾ ವೆಕ್ಟರ್‌ಗಳು",
        live_monitor: "ಲೈವ್ ಹರಾಜು ಮಾನಿಟರ್",
        impact_report: "ಪರಿಣಾಮ_ವರದಿ ವೀಕ್ಷಿಸಿ",
        bid_pulse: "ಬಿಡ್_ನೋಡ್_ಪಲ್ಸ್: ಪರಿಶೀಲಿಸಲಾಗಿದೆ",
        tx_hashed: "ಟ್ರಾನ್ಸಾಕ್ಷನ್ ಹ್ಯಾಶ್ ಮಾಡಲಾಗಿದೆ",
        waf_guard: "WAF ಗಾರ್ಡ್",
        shield_on: "ಶೀಲ್ಡ್_ಆನ್",
        ddos_mitigation: "DDoS ಶಮನ",
        active: "ಸಕ್ರಿಯ",
        live_bidding: "ಪ್ರಸ್ತುತ ಲೈವ್ ಮತ್ತು ಬಿಡ್ಡಿಂಗ್",
        no_live: "ಯಾವುದೇ ಸಕ್ರಿಯ ಲೈವ್ ಸ್ಟ್ರೀಮ್‌ಗಳಿಲ್ಲ_",
        sustainability: "ಸಿಸ್ಟಮ್ ಸುಸ್ಥಿರತೆ",
        offset_text: "ಪ್ಲಾಟ್‌ಫಾರ್ಮ್ ಪ್ರಸ್ತುತ ಪರಿಶೀಲಿಸಿದ ರೈತ ನೋಡ್‌ಗಳ ಮೂಲಕ 14.2 ಟನ್ ಕಾರ್ಬನ್ ಅನ್ನು ಆಫ್‌ಸೆಟ್ ಮಾಡುತ್ತಿದೆ."
      },
      broadcast: {
        console: "ಪ್ರಸಾರ ಕನ್ಸೋಲ್",
        injection: "ಜಾಗತಿಕ ಅಧಿಸೂಚನೆ ಇಂಜೆಕ್ಷನ್ ಇಂಟರ್ಫೇಸ್",
        subject: "ಪ್ರಸಾರ ವಿಷಯವನ್ನು ನಮೂದಿಸಿ_",
        signature: "ಸಹಿ ಪ್ರಕಾರ",
        payload: "ಪೇಲೋಡ್ ವಿಷಯ",
        finalize: "ರವಾನೆಯನ್ನು_ಅಂತಿಮಗೊಳಿಸಿ",
        sending: "ಸಿಗ್ನಲ್_ಇಂಜೆಕ್ಟ್ ಮಾಡಲಾಗುತ್ತಿದೆ...",
        success: "ಜಾಗತಿಕ ಪ್ರಸಾರವನ್ನು ಕಳುಹಿಸಲಾಗಿದೆ_",
        fail: "ಪ್ರಸಾರ ವಿಫಲಗೊಂಡಿದೆ_",
        footer: "ಜಾಗತಿಕ ಸಿಗ್ನಲ್‌ಗಳು ತಕ್ಷಣವೇ ಮೇಲಿನ ಘೋಷಣೆ ಪಟ್ಟಿಯಲ್ಲಿ ಮತ್ತು ಬಳಕೆದಾರರ ಅಧಿಸೂಚನೆ ಕೇಂದ್ರಗಳಲ್ಲಿ ಗೋಚರಿಸುತ್ತವೆ."
      },
      exchange: {
        registry: "ವಿನಿಮಯ ನಿಯಂತ್ರಣ ನೋಂದಣಿ",
        initiate: "ಹೊಸ_ಹರಾಜು_ಪ್ರಾರಂಭಿಸಿ",
        cancel: "ಕ್ರಮ_ರದ್ದುಗೊಳیسی",
        title_label: "ಹರಾಜು_ಶೀರ್ಷಿಕೆ",
        type_label: "ವಿನಿಮಯ_ಪ್ರಕಾರ",
        farmer_label: "ರೈತ ಹಂಚಿಕೆ",
        base_price: "ಮೂಲ_ಬೆಲೆ",
        scheduled_time: "ನಿಗದಿತ_ಸಮಯ",
        deploy: "ಪರಿಸರ ವ್ಯವಸ್ಥೆಗೆ_ನಿಯೋಜಿಸಿ",
        active_tab: "ಸಕ್ರಿಯ ಮತ್ತು ನಿಗದಿತ",
        history_tab: "ಇತಿಹಾಸ / ಇತ್ಯರ್ಥ",
        uid: "ಸಿಗ್ನಲ್_UID",
        entity: "ವಿನಿಮಯ_ಅಸ್ತಿತ್ವ",
        status_node: "ಸ್ಥಿತಿ_ನೋಡ್",
        valuation: "ಮೌಲ್ಯಮಾಪನ_ಮಟ್ಟ",
        winner: "ವಿಜೇತ_ನೋಡ್",
        close: "ಮುಚ್ಚಿ",
        confirm_delete: "ನೀವು ಖಚಿತವಾಗಿರುವಿರಾ? ಈ ಕ್ರಮವನ್ನು ರದ್ದುಗೊಳಿಸಲು ಸಾಧ್ಯವಿಲ್ಲ.",
        no_records: "ಯಾವುದೇ ದಾಖಲೆಗಳು ಕಂಡುಬಂದಿಲ್ಲ"
      },
      users: {
        title: "ಎಂಟಿಟಿ_ಡೈರೆಕ್ಟರಿ ಎನ್‌ಕ್ರಿಪ್ಟ್ ಮಾಡಲಾಗಿದೆ",
        auth_required: "ಕೇಂದ್ರ ನೋಡ್‌ನಿಂದ ಪಾಲುದಾರ_ವಿಮರ್ಶೆಗೆ ದೃಢೀಕರಣ ಅಗತ್ಯವಿದೆ"
      }
    }
  },
  te: {
    nav: {
      groups: { core: "ప్రధాన వ్యవస్థలు", assets: "ప్లాట్‌ఫారమ్ ఆస్తులు" },
      overview: "అవలోకనం",
      auction: "లైవ్ వేలం",
      wallet: "వాలెట్",
      analytics: "విశ్లేషణ",
      problem: "సమస్య",
      how_it_works: "ఎలా పనిచేస్తుంది",
      verify: "ధృవీకరించండి",
      market: "మార్కెట్",
      admin: "అడ్మిన్",
      signin: "సైన్ ఇన్",
      join: "చేరండి"
    },
    hero: {
      title: "పారదర్శకత కోసం రూపొందించబడింది",
      subtitle: "మా బహుళ-పొర ధృవీకరణ వ్యవస్థ ప్రతి కార్బన్ క్రెడిట్ శాస్త్రీయ వాస్తవంతో మద్దతునిస్తుందని నిర్ధారిస్తుంది.",
      start_earning: "సంపాదించడం ప్రారంభించండి",
      watch_demo: "డెమో చూడండి"
    },
    features: {
      title: "పారదర్శకత కోసం నిర్మించబడింది",
      subtitle: "మా ధృవీకరణ వ్యవస్థ శాస్త్రీయంగా ధృవీకరించబడింది.",
      satellite: {
        title: "శాటిలైట్ ధృవీకరణ",
        desc: "NDVI విశ్లేషణను ఉపయోగించి వ్యవసాయ భూమి పరిస్థితులు మరియు వృక్ష ఆరోగ్యం యొక్క ధృవీకరణ."
      },
      ai: {
        title: "AI స్కోరింగ్",
        desc: "Mastra AI వృక్ష డేటాను విశ్లేషిస్తుంది మరియు స్వయంచాలకంగా స్థిరత్వ స్కోర్ ఇస్తుంది."
      },
      blockchain: {
        title: "బ్లాక్‌చైన్ టోకెన్",
        desc: "ధృవీకరించబడిన కార్బన్ తగ్గింపు Polygon లో ERC-1155 టోకెన్లుగా మార్చబడుతుంది."
      },
      market: {
        title: "కార్బన్ మార్కెట్",
        desc: "కంపెనీలు ఎటువంటి మధ్యవర్తులు లేకుండా నేరుగా రైతుల నుండి క్రెడిట్లను కొనుగోలు చేస్తాయి."
      }
    },
    event: {
      upcoming: "రాబోయే ఈవెంట్",
      title: "పంట",
      subtitle: "ప్రారంభం",
      time: "సమయం",
      register: "సీటు కోసం నమోదు చేసుకోండి"
    },
    problem: {
      desc: "సాంప్రదాయ సరఫరా గొలుసులు అపారదర్శక మరియు అసమర్థంగా ఉన్నాయి. చిన్న రైతులకు నష్టం జరుగుతోంది.",
      traceability: {
        title: "అపారదర్శక గుర్తింపు",
        desc: "నేల ఆరోగ్యం లేదా రసాయన రహిత క్లెయిమ్‌లను ధృవీకరించడానికి మార్గం లేదు."
      },
      middleman: {
        title: "మధ్యవర్తుల పన్ను",
        desc: "లేయర్డ్ కమిషన్ నిర్మాణాలు రైతు ఆదాయాన్ని తగ్గిస్తున్నాయి."
      },
      greenwash: {
        title: "గ్రీన్‌వాషింగ్",
        desc: "ధృవీకరించని కార్బన్ క్రెడిట్లను ప్రీమియంగా విక్రయిస్తున్నారు."
      }
    },
    dashboard: {
      welcome: "స్వాగతం,",
      market_data: "మార్కెట్ డేటా",
      active_bids: "యాక్టివ్ బిడ్లు",
      token_balance: "టోకెన్ బ్యాలెన్స్",
      verification_status: "ధృవీకరణ స్థితి",
      recent_activity: "ఇటీవలి కార్యకలాపాలు",
      impact: "మీ ప్రభావం",
      farmer_hub: "రైతు_హబ్",
      market_analytics: "మార్కెట్_అనలిటిక్స్",
      user_role: "గుర్తింపు_పాత్ర",
      status: "నోడ్_స్థితి",
      verified: "ధృవీకరించబడింది",
      unauthorized: "అనధికారిక",
      select_location: "ఫార్మ్ స్థానాన్ని ఎంచుకోండి",
      tap_map: "ధృవీకరణ నోడ్‌ను యాంకర్ చేయడానికి మ్యాప్‌పై నొక్కండి",
      inventory_live: "ఇన్వెంటరీ_లైవ్",
      receipt: "చివరి_లావాదేవీ_రశీదు",
      supply_analysis: "సరఫరా_విశ్ಲೇషణ",
      supply_desc: "నమోదిత రైతు నోడ్‌లలో కార్బన్ సీక్వెస్ట్రేషన్ కోసం నిజ-సమయ ధృవీకరణ కొలమానాలు.",
      impact_score: "ప్రభావ స్కోరు",
      offset_volume: "ఆఫ్‌సెట్ వాల్యూమ్",
      procurement_stats: "కొనుగోలు గణాంకాలు",
      producers: "యాక్టివ్ నిర్మాతలు",
      qr_scans: "ధృవీకరణ స్కాన్‌లు",
      top_region: "టాప్ సప్లై రీజియన్",
      nav_exchange: "ఎక్స్ఛేంజ్ వెళ్ళండి",
      wallet: "నోడ్ వాలెట్",
      land: "నమోదిత భూమి",
      network: "పర్యావరణ వ్యవస్థ",
      impact_metric: "ప్రభావం వృద్ధి"
    },
    footer: {
      terms: "సేవా నిబంధనలు",
      privacy: "గోప్యత",
      api: "API పత్రాలు",
      copyright: "© 2026 గ్రీన్‌లెడ్జర్ అటానమస్ సిస్టమ్స్"
    },
    admin: {
      title: "రూట్_టెర్మినల్",
      auth_ok: "అడ్మిన్ ప్రామాణీకరణ: బాగుంది",
      tabs: {
        overview: "మార్కెట్_సారాంశం",
        announcements: "ప్రసార_హబ్",
        auctions: "మార్పిడి_నియంత్రణ",
        users: "ఎంటిటీ_రిజిస్ట్రీ"
      },
      logs: "భద్రతా_లాగ్లు",
      stats: {
        velocity: "నెట్‌వర్క్_వేగం",
        entities: "యాక్టివ్_ఎంటిటీలు",
        volume: "మార్పిడి_వాల్యూమ్",
        uptime: "భద్రతా_అప్‌టైమ్"
      },
      overview: {
        core_status: "మార్పిడి_కోర్ స్థితి",
        integrity: "ప్లాట్‌ఫారమ్ కార్యాచరణ సమగ్రత",
        optimal: "అత్యుత్తమ",
        live_sessions: "లైవ్ సెషన్లు",
        commitment_bids: "నిబద్ధత బిడ్లు",
        seats_reserved: "సీట్లు రిజర్వ్ చేయబడ్డాయి",
        recent_activity: "ఇటీవలి కార్యాచరణ హబ్",
        security_vectors: "భద్రతా వెక్టర్స్",
        live_monitor: "లైవ్ వేలం మానిటర్",
        impact_report: "ప్రభావ_నివేదికను చూడండి",
        bid_pulse: "బిడ్_నోడ్_పల్స్: ధృవీకరించబడింది",
        tx_hashed: "లావాదేవీ హ్యాష్ చేయబడింది",
        waf_guard: "WAF గార్డ్",
        shield_on: "షీల్డ్_ఆన్",
        ddos_mitigation: "DDoS తగ్గింపు",
        active: "యాక్టివ్",
        live_bidding: "ప్రస్తుతం లైవ్ & బిడ్డింగ్",
        no_live: "యాక్టివ్ లైవ్ స్ట్రీమ్‌లు లేవు_",
        sustainability: "సిస్టమ్ స్థిరత్వం",
        offset_text: "ప్లాట్‌ఫారమ్ ప్రస్తుతం ధృవీకరించబడిన రైతు నోడ్‌ల ద్వారా 14.2 టన్నుల కార్బన్‌ను ఆఫ్‌సెట్ చేస్తోంది."
      },
      broadcast: {
        console: "ప్రసార కన్సోల్",
        injection: "గ్లోబల్ నోటిఫికేషన్ ఇంజెక్షన్ ఇంటర్‌ఫేస్",
        subject: "ప్రసార విషయాన్ని నమోదు చేయండి_",
        signature: "సంతకం రకం",
        payload: "పేలోడ్ కంటెంట్",
        finalize: "డిస్పాచ్_ఖరారు చేయండి",
        sending: "సిగ్నల్_ఇంజెక్ట్ చేయబడుతోంది...",
        success: "గ్లోబల్ బ్రాడ్‌కాస్ట్ పంపబడింది_",
        fail: "బ్రాడ్‌కాస్ట్ విఫలమైంది_",
        footer: "గ్లోబల్ సిగ్నల్‌లు తక్షణమే టాప్ అనౌన్స్‌మెంట్ స్ట్రిప్ మరియు యూజర్ నోటిఫికేషన్ హబ్‌లలో కనిపిస్తాయి."
      },
      exchange: {
        registry: "మార్పిడి నియంత్రణ రిజిస్ట్రీ",
        initiate: "కొత్త_వేలం_ప్రారంభించండి",
        cancel: "చర్యను_రద్దు చేయండి",
        title_label: "వేలం_శీర్షిక",
        type_label: "మార్పిడి_రకం",
        farmer_label: "రైతు కేటాయింపు",
        base_price: "బేస్_ధర",
        scheduled_time: "షెడ్యూల్_సమయం",
        deploy: "పర్యావరణ వ్యవస్థకు_నియోగించండి",
        active_tab: "యాక్టివ్ మరియు షెడ్యూల్ చేయబడింది",
        history_tab: "చరిత్ర / పరిష్కారం",
        uid: "సిగ్నల్_UID",
        entity: "మార్పిడి_ఎంటిటీ",
        status_node: "స్థితి_నోడ్",
        valuation: "వాల్యుయేషన్_ఫ్లోర్",
        winner: "విజేత_నోడ్",
        close: "మూసివేయి",
        confirm_delete: "మీరు ఖచ్చితంగా ఉన్నారా? ఈ చర్యను రద్దు చేయలేరు.",
        no_records: "రికార్డులు ఏవీ కనుగొనబడలేదు"
      },
      users: {
        title: "ఎంటిటీ_డైరెక్టరీ ఎన్‌క్రిప్ట్ చేయబడింది",
        auth_required: "సెంట్రల్ నోడ్ నుండి భాగస్వామి_సమీక్ష కోసం అధికారం అవసరం"
      }
    }
  },
  mr: {
    nav: {
      groups: { core: "मुख्य प्रणाली", assets: "प्लॅटफॉर्म मालमत्ता" },
      overview: "आढावा",
      auction: "लाइव्ह लिलाव",
      wallet: "वॉलेट",
      analytics: "विश्लेषण",
      problem: "समस्या",
      how_it_works: "हे कसे कार्य करते",
      verify: "सत्यापित करा",
      market: "बाजार",
      admin: "अ‍ॅडमिन",
      signin: "साइन इन करा",
      join: "सहभागी व्हा"
    },
    hero: {
      title: "पारदर्शकतेसाठी इंजिनियर",
      subtitle: "आमची बहु-स्तरीय पडताळणी यंत्रणा प्रत्येक कार्बन क्रेडिट वैज्ञानिक वास्तवावर आधारित असल्याची खात्री करते.",
      start_earning: "कमावण्यास सुरुवात करा",
      watch_demo: "डेमो पहा"
    },
    features: {
      title: "पारदर्शकतेसाठी निर्मित",
      subtitle: "आमची पडताळणी यंत्रणा वैज्ञानिकदृष्ट्या प्रमाणित आहे.",
      satellite: {
        title: "सॅटेलाईट पडताळणी",
        desc: "NDVI विश्लेषण वापरून शेतजमिनीची स्थिती आणि वनस्पती आरोग्याची पडताळणी."
      },
      ai: {
        title: "AI स्कोअरिंग",
        desc: "Mastra AI वनस्पती डेटाचे विश्लेषण करते और स्वचालित रूप से स्थिरता स्कोर देते."
      },
      blockchain: {
        title: "ब्लॉकचेन टोकन",
        desc: "सत्यापित कार्बन कपात Polygon वर ERC-1155 टोकनमध्ये रूपांतरित केली जाते."
      },
      market: {
        title: "कार्बन मार्केट",
        desc: "कंपन्या मध्यस्थांशिवाय थेट शेतकऱ्यांकडून क्रेडिट खरेदी करतात."
      }
    },
    event: {
      upcoming: "आगामी कार्यक्रम",
      title: "पीक",
      subtitle: "प्रारंभ",
      time: "वेळ",
      register: "सीटसाठी नोंदणी करा"
    },
    problem: {
      desc: "पारंपारिक पुरवठा साखळ्या अपारदर्शक आणि अकार्यक्षम आहेत. अल्पभूधारक शेतकऱ्यांचे नुकसान होत आहे.",
      traceability: {
        title: "अपारदर्शक शोधण्यायोग्यता",
        desc: "मातीचे आरोग्य किंवा रसायनमुक्त दाव्यांची पडताळणी करण्याचा कोणताही मार्ग नाही."
      },
      middleman: {
        title: "मध्यस्थांचा कर",
        desc: "स्तरित कमिशन संरचना शेतकऱ्याचा महसूल कमी करत आहेत."
      },
      greenwash: {
        title: "ग्रीनवाशिंग",
        desc: "न पडताळलेले कार्बन क्रेडिट्स प्रीमियम म्हणून विकले जात आहेत."
      }
    },
    dashboard: {
      welcome: "स्वागत आहे,",
      market_data: "मार्केट डेटा",
      active_bids: "सक्रिय बोली",
      token_balance: "टोकन शिल्लक",
      verification_status: "पडताळणी स्थिती",
      recent_activity: "अलीकडील क्रियाकलाप",
      impact: "तुमचा प्रभाव",
      farmer_hub: "शेतकरी_हब",
      market_analytics: "बाजार_विश्लेषण",
      user_role: "ओळख_भूमिका",
      status: "नोड_स्थिती",
      verified: "पडताळणी झाली",
      unauthorized: "अनधिकृत",
      select_location: "शेतीचे ठिकाण निवडा",
      tap_map: "पडताळणी नोड अँकर करण्यासाठी नकाशावर टॅप करा",
      inventory_live: "मालसाठा_लाइव्ह",
      receipt: "शेवटची_व्यवहार_पावती",
      supply_analysis: "पुरवठा_विश्लेषण",
      supply_desc: "नोंदणीकृत शेतकरी नोड्समध्ये कार्बन सीक्वेस्ट्रेशनसाठी रिअल-टाइम पडताळणी मेट्रिक्स.",
      impact_score: "प्रभाव स्कोअर",
      offset_volume: "ऑफसेट व्हॉल्यूम",
      procurement_stats: "खरेदी आकडेवारी",
      producers: "सक्रिय उत्पादक",
      qr_scans: "पडताळणी स्कॅन",
      top_region: "शीर्ष पुरवठा क्षेत्र",
      nav_exchange: "एक्सचेंजवर जा",
      wallet: "नोड वॉलेट",
      land: "नोंदणीकृत जमीन",
      network: "पारिस्थितिकी तंत्र",
      impact_metric: "प्रभाव वाढ"
    },
    footer: {
      terms: "सेवेच्या अटी",
      privacy: "गोपनीयता",
      api: "API दस्तऐवज",
      copyright: "© 2026 ग्रीनलेजर ऑटोनॉमस सिस्टम्स"
    },
    admin: {
      title: "रूट_टर्मिनल",
      auth_ok: "अ‍ॅडमिन प्रमाणीकरण: ठीक",
      tabs: {
        overview: "मार्केट_सारांश",
        announcements: "प्रसारण_हब",
        auctions: "एक्सचेंज_नियंत्रण",
        users: "इकाई_नोंदणी"
      },
      logs: "सुरक्षा_लॉग",
      stats: {
        velocity: "नेटवर्क_वेग",
        entities: "सक्रिय_घटक",
        volume: "एक्सचेंज_व्हॉल्यूम",
        uptime: "सुरक्षा_अपटाइम"
      },
      overview: {
        core_status: "एक्सचेंज_कोअर स्थिती",
        integrity: "प्लॅटफॉर्म परिचालन अखंडता",
        optimal: "उत्कृष्ट",
        live_sessions: "लाइव्ह सत्रात",
        commitment_bids: "प्रतिबद्धता बोली",
        seats_reserved: "जागा राखीव",
        recent_activity: "अलीकडील क्रियाकलाप हब",
        security_vectors: "सुरक्षा विभाग",
        live_monitor: "लाइव्ह लिलाव मॉनिटर",
        impact_report: "प्रभाव_अहवाल पहा",
        bid_pulse: "बिड_नोड_पल्स: पडताळणी झाली",
        tx_hashed: "व्यवहार हॅश केला",
        waf_guard: "WAF गार्ड",
        shield_on: "शील्ड_ऑन",
        ddos_mitigation: "DDoS कमी करणे",
        active: "सक्रिय",
        live_bidding: "सध्या लाइव्ह आणि लिलाव सुरू",
        no_live: "कोणतेही सक्रिय लाइव्ह स्ट्रीम नाहीत_",
        sustainability: "सिस्टम स्थिरता",
        offset_text: "प्लॅटफॉर्म सध्या नोंदणीकृत शेतकरी नोड्सद्वारे 14.2 टन कार्बन ऑफसेट करत आहे."
      },
      broadcast: {
        console: "प्रसारण कन्सोल",
        injection: "ग्लोबल नोटिफिकेशन इंजेक्शन इंटरफेस",
        subject: "प्रसारण विषय प्रविष्ट करा_",
        signature: "स्वाक्षरी प्रकार",
        payload: "पेलोड मजकूर",
        finalize: "डिस्पॅच_अंतिम करा",
        sending: "सिग्नल_इंजेक्ट केला जात आहे...",
        success: "जागतिक प्रसारण पाठवले_",
        fail: "प्रसारण अयशस्वी_",
        footer: "जागतिक सिग्नल वरच्या घोषणा पट्टी आणि वापरकर्ता सूचना केंद्रांमध्ये त्वरित दिसतात."
      },
      exchange: {
        registry: "एक्सचेंज नियंत्रण नोंदणी",
        initiate: "नवीन_लिलाव_सुरू करा",
        cancel: "कृती_रद्द करा",
        title_label: "लिलाव_शीर्षक",
        type_label: "एक्सचेंज_प्रकार",
        farmer_label: "शेतकरी वाटप",
        base_price: "मूळ_किंमत",
        scheduled_time: "नियोजित_वेळ",
        deploy: "पर्यावरण व्यवस्थेत_तैनात करा",
        active_tab: "सक्रिय आणि नियोजित",
        history_tab: "इतिहास / सेटलमेंट",
        uid: "सिग्नल_UID",
        entity: "एक्सचेंज_घटक",
        status_node: "स्थिती_नोड",
        valuation: "मूल्यांकन_स्तर",
        winner: "विजेता_नोड",
        close: "बंद करा",
        confirm_delete: "तुम्हाला खात्री आहे का? ही कृती परत करता येणार नाही.",
        no_records: "कोणतेही रेकॉर्ड सापडले नाहीत"
      },
      users: {
        title: "घटक_संचयिका एन्क्रिप्टेड",
        auth_required: "सेंट्रल नोडकडून जोडीदार_समीक्षेसाठी अधिकृतता आवश्यक आहे"
      }
    }
  }
};
