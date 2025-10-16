import React, { useState } from 'react';
import axios from 'axios';

function SearchResultCard({ article, baseUrl, token }) {
    const [message, setMessage] = useState('');
    const [saving, setSaving] = useState(false);
    
    const isAuthenticated = !!token; 

    const handleSave = async () => {
        if (!isAuthenticated) {
            setMessage('Please log in to save articles.');
            return;
        }

        setSaving(true);
        setMessage('Saving...');
        
        try {
            await axios.post(`${baseUrl}/api/articles/`, 
                {
                    title: article.title, 
                    url: article.url,
                    summary: article.summary,
                    page_id: article.page_id,
                }, 
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                }
            );

            setMessage('Article saved successfully!');
            
        } catch (err) {
            console.error('Save article error:', err);
            setMessage(
                (err.response?.data?.detail) || 
                'Failed to save article.'
            );
        } finally {
            setSaving(false);
        }
    };

    return (
        <div>
            <h4>
                <a 
                    href={article.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                >
                    {article.title}
                </a>
            </h4>
            <p>
                **Summary:** {article.summary}
            </p>

            {isAuthenticated && (
                <button onClick={handleSave} disabled={saving}>
                    {saving ? 'Saving...' : 'Save Article'}
                </button>
            )}
            
            {message && <p style={{ color: 'blue' }}>{message}</p>}
            <hr /> 
        </div>
    );
}

export default SearchResultCard;