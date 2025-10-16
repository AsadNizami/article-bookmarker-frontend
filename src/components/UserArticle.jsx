import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import SavedArticleCard from './SavedArticleCard'; 

function UserArticles({ baseUrl, token }) {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchArticles = useCallback(async () => {
        setLoading(true);
        setError('');

        try {
            const response = await axios.get(`${baseUrl}/api/view_articles/`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            setArticles(response.data);
        } catch (err) {
            console.error('Fetch articles error:', err);
            setError(
                (err.response?.data?.detail) || 
                'Failed to fetch articles. You might need to log in again.'
            );
        } finally {
            setLoading(false);
        }
    }, [baseUrl, token]);

    useEffect(() => {
        fetchArticles();
    }, [fetchArticles]);

    const handleArticleDelete = (deletedArticleId) => {
        setArticles(prevArticles =>
            prevArticles.filter(article => article.id !== deletedArticleId)
        );
    };

    if (loading) return <p>Loading your saved articles...</p>;
    if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;

    return (
        <div>
            <h2>My Saved Articles</h2>
            <div>
                {articles.length > 0 ? (
                    articles.map(article => (
                        <SavedArticleCard
                            key={article.id}
                            article={article}
                            baseUrl={baseUrl}
                            token={token}
                            onDelete={handleArticleDelete}
                        />
                    ))
                ) : (
                    <p>You haven't saved any articles yet.</p>
                )}
            </div>
        </div>
    );
}

export default UserArticles;