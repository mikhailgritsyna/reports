const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files
app.use(express.static('public'));

const FB_API_VERSION = 'v18.0';
const FB_GRAPH_URL = 'https://graph.facebook.com';

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'OK', message: 'AdsPulse Backend is running' });
});

// Get campaigns data
app.post('/api/campaigns', async (req, res) => {
    try {
        const { token, accountId } = req.body;

        if (!token || !accountId) {
            return res.status(400).json({ 
                error: 'Missing token or accountId' 
            });
        }

        // Format account ID
        const formattedAccountId = accountId.startsWith('act_') 
            ? accountId 
            : `act_${accountId}`;

        // Get campaigns
        const campaignsUrl = `${FB_GRAPH_URL}/${FB_API_VERSION}/${formattedAccountId}/campaigns`;
        const campaignsResponse = await axios.get(campaignsUrl, {
            params: {
                fields: 'id,name,status,created_time',
                access_token: token,
                limit: 100
            },
            timeout: 10000
        });

        if (!campaignsResponse.data.data) {
            return res.status(400).json({ 
                error: 'No campaigns found or invalid credentials' 
            });
        }

        const campaigns = campaignsResponse.data.data;
        const campaignsWithStats = [];

        let totalSpend = 0;
        let totalClicks = 0;
        let totalLeads = 0;
        let totalImpressions = 0;

        // Get insights for each campaign
        for (const campaign of campaigns.slice(0, 40)) {
            try {
                const insightsUrl = `${FB_GRAPH_URL}/${FB_API_VERSION}/${campaign.id}/insights`;
                const insightsResponse = await axios.get(insightsUrl, {
                    params: {
                        fields: 'spend,impressions,clicks,actions',
                        access_token: token,
                        date_preset: 'last_7d'
                    },
                    timeout: 5000
                });

                let spend = 0;
                let impressions = 0;
                let clicks = 0;
                let leads = 0;

                if (insightsResponse.data.data && insightsResponse.data.data.length > 0) {
                    const stats = insightsResponse.data.data[0];
                    spend = parseFloat(stats.spend || 0);
                    impressions = parseInt(stats.impressions || 0);
                    clicks = parseInt(stats.clicks || 0);

                    if (stats.actions) {
                        stats.actions.forEach(action => {
                            if (action.action_type === 'lead') {
                                leads += parseInt(action.value || 0);
                            }
                        });
                    }
                }

                const ctr = impressions > 0 ? (clicks / impressions * 100) : 0;
                const cpm = impressions > 0 ? (spend / impressions * 1000) : 0;
                const cpc = clicks > 0 ? (spend / clicks) : 0;
                const cpl = leads > 0 ? (spend / leads) : 0;

                campaignsWithStats.push({
                    id: campaign.id,
                    name: campaign.name,
                    status: campaign.status,
                    spend: Math.round(spend * 100) / 100,
                    impressions: impressions,
                    clicks: clicks,
                    leads: leads,
                    ctr: Math.round(ctr * 100) / 100,
                    cpm: Math.round(cpm * 100) / 100,
                    cpc: Math.round(cpc * 100) / 100,
                    cpl: Math.round(cpl * 100) / 100
                });

                totalSpend += spend;
                totalClicks += clicks;
                totalLeads += leads;
                totalImpressions += impressions;

            } catch (error) {
                console.error(`Error fetching insights for campaign ${campaign.id}:`, error.message);
            }
        }

        // Sort by spend
        campaignsWithStats.sort((a, b) => b.spend - a.spend);

        const avgCPL = totalLeads > 0 ? Math.round((totalSpend / totalLeads) * 100) / 100 : 0;

        res.json({
            success: true,
            data: {
                campaigns: campaignsWithStats,
                totals: {
                    spend: Math.round(totalSpend * 100) / 100,
                    clicks: totalClicks,
                    leads: totalLeads,
                    impressions: totalImpressions,
                    avgCPL: avgCPL
                }
            }
        });

    } catch (error) {
        console.error('Error:', error.message);
        
        if (error.response?.status === 400) {
            return res.status(400).json({ 
                error: 'Invalid token or account ID' 
            });
        }

        res.status(500).json({ 
            error: error.message || 'Failed to fetch data from Facebook API' 
        });
    }
});

// Error handling
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ 
        error: 'Internal server error' 
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`AdsPulse Backend running on port ${PORT}`);
});
