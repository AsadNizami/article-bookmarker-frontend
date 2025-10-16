import React, { useState } from 'react';
import axios from 'axios';

function SavedArticleCard({ article, baseUrl, token, onDelete }) {
    const [message, setMessage] = useState('');
    const [deleting, setDeleting] = useState(false);
    
    const [isEditing, setIsEditing] = useState(false);
    
    const tagsToString = (tags) => tags ? tags.map(tag => tag.name).join(', ') : '';
    
    const [editTagsInput, setEditTagsInput] = useState(() => tagsToString(article.tags));

    const handleDelete = async () => {
        setDeleting(true);
        setMessage('Deleting...');
        
        try {
            await axios.delete(`${baseUrl}/api/articles/${article.id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            setMessage(`Article "${article.title}" deleted successfully.`);
            if (onDelete) {
                onDelete(article.id);
            }
            
        } catch (err) {
            console.error('Delete article error:', err);
            setMessage(
                (err.response?.data?.detail) || 
                'Failed to delete article.'
            );
            setDeleting(false); 
        }
    };
    
    const handleTagSave = async () => {
        setMessage('Updating tags...');
        
        const tagsArray = editTagsInput
            .split(',')
            .map(tag => tag.trim())
            .filter(tag => tag.length > 0);

        try {
            const response = await axios.patch(`${baseUrl}/api/articles/${article.id}/tags/`, 
                {
                    new_tags: tagsArray,
                },
                {
                    headers: { 'Authorization': `Bearer ${token}` },
                }
            );
            
            article.tags = response.data.tags; 
            
            setMessage('Tags updated successfully!');
            setIsEditing(false); 

        } catch (err) {
            console.error('Tag update error:', err);
            setMessage(
                (err.response?.data?.detail) || 
                'Failed to update tags.'
            );
        }
    };
    
    const handleCancel = () => {
        setEditTagsInput(tagsToString(article.tags));
        setIsEditing(false);
    };

    const currentTagsDisplay = article.tags && article.tags.length > 0 ? 
        article.tags.map(tag => tag.name).join(' | ') : 
        "No tags";

    return (
        <div>
            <h4>
                <a href={article.url} target="_blank" rel="noopener noreferrer">
                    {article.title}
                </a>
            </h4>
            
            <p>**Summary:** {article.summary}</p> 

            {!isEditing ? (
                <p>
                    **Tags:** {currentTagsDisplay}
                    <button onClick={() => setIsEditing(true)} style={{ marginLeft: '10px' }}>
                        Edit Tags
                    </button>
                </p>
            ) : (
                <div>
                    <label>Edit Tags (comma separated):</label>
                    <input
                        type="text"
                        value={editTagsInput}
                        onChange={(e) => setEditTagsInput(e.target.value)}
                        placeholder="Tag1, Tag2, Tag3"
                    />
                    <button onClick={handleTagSave}>Save Changes</button>
                    <button onClick={handleCancel}>Cancel</button>
                </div>
            )}

            <button onClick={handleDelete} disabled={deleting}>
                {deleting ? 'Deleting...' : 'Delete Article'}
            </button>
            {message && <p style={{ color: 'blue' }}>{message}</p>}
            <hr /> 
        </div>
    );
}

export default SavedArticleCard;