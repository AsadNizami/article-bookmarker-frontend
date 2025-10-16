import React, { useState } from 'react';
import SearchPage from './components/SearchPage';
import AuthForm from './components/AuthForm'; 
import UserArticles from './components/UserArticle';

const BASE_URL = 'https://article-bookmarker.onrender.com'; // 'http://127.0.0.1:8000';  //

const VIEWS = {
    LOGIN: 'login',
    REGISTER: 'register',
    SEARCH: 'search',
    ARTICLES: 'articles', 
};

function App() {
    const [token, setToken] = useState(null);
    const [currentView, setCurrentView] = useState(VIEWS.LOGIN);

    const handleAuthSuccess = (accessToken) => {
        setToken(accessToken);
        setCurrentView(VIEWS.SEARCH);
    };

    const handleLogout = () => {
        setToken(null);
        setCurrentView(VIEWS.LOGIN);
    };

    const renderView = () => {
        if (!token) {
            switch (currentView) {
                case VIEWS.REGISTER:
                    return (
                        <div>
                            <h2>Register</h2>
                            <AuthForm type="register" baseUrl={BASE_URL} onAuthSuccess={handleAuthSuccess} />
                            <p>
                                Already have an account?{' '}
                                <button onClick={() => setCurrentView(VIEWS.LOGIN)}>
                                    Go to Login
                                </button>
                            </p>
                        </div>
                    );
                case VIEWS.LOGIN:
                default:
                    return (
                        <div>
                            <h2>Login</h2>
                            <AuthForm type="login" baseUrl={BASE_URL} onAuthSuccess={handleAuthSuccess} />
                            <p>
                                Don't have an account?{' '}
                                <button onClick={() => setCurrentView(VIEWS.REGISTER)}>
                                    Go to Register
                                </button>
                            </p>
                        </div>
                    );
            }
        } else {
            return (
                <div>
                    <h1>Article Bookmarker App</h1>
                    <nav>
                        <button onClick={() => setCurrentView(VIEWS.SEARCH)}>
                            Search Articles
                        </button>
                        <button onClick={() => setCurrentView(VIEWS.ARTICLES)}> 
                            My Articles
                        </button>
                        <button onClick={handleLogout}>
                            Logout
                        </button>
                    </nav>
                    <hr />
                    
                    {currentView === VIEWS.SEARCH && (
                        <SearchPage baseUrl={BASE_URL} token={token} />
                    )}
                    {currentView === VIEWS.ARTICLES && (
                        <UserArticles baseUrl={BASE_URL} token={token} />
                    )}
                </div>
            );
        }
    };

    return (
        <div>
            {renderView()}
        </div>
    );
}

export default App;