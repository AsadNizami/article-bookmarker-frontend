import React, { useState } from 'react';
import axios from 'axios';
import SearchResultCard from './SearchResultCard';

function SearchPage({ baseUrl, token }) {
    const [keyword, setKeyword] = useState('');
    const [maxResults, setMaxResults] = useState(3);
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!keyword.trim()) return;

        setLoading(true);
        setError('');
        setResults([]);

        const url = `${baseUrl}/api/search/${encodeURIComponent(keyword)}`;

        try {
            const response = await axios.get(url, {
                params: {
                    max_results: maxResults
                }
            });

            setResults(response.data.results || []);

        } catch (err) {
            console.error('Search error:', err);
            if (err.response) {
                setError(err.response.data.detail || 'Search failed. Check if the backend is running.');
            } else {
                setError('Could not connect to the API. Network issue.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h2>Wikipedia Search</h2>
            <form onSubmit={handleSearch}>
                <input
                    type="text"
                    placeholder="Enter keyword (e.g., React, Python)"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    required
                />
                <input
                    type="number"
                    placeholder="Max results"
                    value={maxResults}
                    onChange={(e) => setMaxResults(e.target.value)}
                    min="1"
                    required
                />
                <button 
                    type="submit" 
                    disabled={loading}
                >
                    {loading ? 'Searching...' : 'Search'}
                </button>
            </form>

            {error && <p style={{ color: 'red' }}>{error}</p>}

            <h3>Results ({results.length})</h3>
            <div>
                {results.length > 0 ? (
                    results.map((article, index) => (
                        <SearchResultCard
                            key={index}
                            article={article}
                            baseUrl={baseUrl}
                            token={token}    
                        />
                    ))
                ) : (
                    !loading && keyword.trim() && <p>.</p>
                )}
            </div>
        </div>
    );
}

export default SearchPage;