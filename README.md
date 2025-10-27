<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Premium Subscription</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }

        .pricing-card {
            background: white;
            border-radius: 20px;
            padding: 40px;
            max-width: 400px;
            width: 100%;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            text-align: center;
        }

        .auth-section {
            margin-bottom: 20px;
            padding: 15px;
            background: #f8f9fa;
            border-radius: 10px;
        }

        .user-info {
            font-size: 14px;
            color: #666;
            margin-bottom: 10px;
        }

        .auth-button {
            padding: 10px 20px;
            background: #667eea;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
        }

        .auth-button:hover {
            background: #5568d3;
        }

        h1 {
            font-size: 32px;
            color: #333;
            margin-bottom: 10px;
        }

        .subtitle {
            color: #666;
            margin-bottom: 30px;
            font-size: 16px;
        }

        .price {
            font-size: 48px;
            font-weight: bold;
            color: #667eea;
            margin-bottom: 10px;
        }

        .price-period {
            color: #999;
            font-size: 14px;
            margin-bottom: 30px;
        }

        .features {
            text-align: left;
            margin-bottom: 30px;
        }

        .feature {
            padding: 12px 0;
            border-bottom: 1px solid #f0f0f0;
            color: #555;
            display: flex;
            align-items: center;
        }

        .feature:last-child {
            border-bottom: none;
        }

        .feature::before {
            content: "✓";
            color: #667eea;
            font-weight: bold;
            margin-right: 10px;
            font-size: 18px;
        }

        .button {
            width: 100%;
            padding: 16px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            border-radius: 10px;
            font-size: 18px;
            font-weight: 600;
            cursor: pointer;
            transition: transform 0.2s, box-shadow 0.2s;
            text-decoration: none;
            display: inline-block;
        }

        .button:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: 0 10px 20px rgba(102, 126, 234, 0.4);
        }

        .button:disabled {
            opacity: 0.6;
            cursor: not-allowed;
        }

        .button.secondary {
            background: #6c757d;
            margin-top: 10px;
        }

        .message {
            margin-top: 15px;
            font-size: 14px;
            padding: 12px;
            border-radius: 5px;
        }

        .info-message {
            background: #e3f2fd;
            color: #1976d2;
        }

        .success-message {
            background: #efe;
            color: #3c3;
        }

        .hidden {
            display: none;
        }

        .status-badge {
            display: inline-block;
            padding: 6px 12px;
            background: #4caf50;
            color: white;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
            margin-bottom: 15px;
        }
    </style>
</head>
<body>
    <div class="pricing-card">
        <!-- Auth Section -->
        <div class="auth-section">
            <div id="logged-out">
                <p class="user-info">Sign in to subscribe</p>
                <button class="auth-button" id="sign-in-button">🔐 Sign In with Google</button>
            </div>
            <div id="logged-in" class="hidden">
                <p class="user-info">👤 <span id="user-email"></span></p>
                <button class="auth-button" id="sign-out-button">Sign Out</button>
            </div>
        </div>

        <!-- Pricing Info -->
        <h1>Premium Plan</h1>
        <p class="subtitle">Unlock all premium features</p>
        
        <div class="price">$29</div>
        <div class="price-period">per month</div>

        <div class="features">
            <div class="feature">Access to all premium features</div>
            <div class="feature">Priority customer support</div>
            <div class="feature">Advanced analytics dashboard</div>
            <div class="feature">Unlimited exports</div>
            <div class="feature">API access</div>
        </div>

        <!-- Not Subscribed View -->
        <div id="not-subscribed">
            <a href="https://buy.stripe.com/test_00g8xq8J5fHr9eUeUU" 
               class="button" 
               id="subscribe-button"
               target="_blank">
                Subscribe Now
            </a>
            <p class="message info-message" id="login-prompt">
                Please sign in to continue
            </p>
        </div>

        <!-- Subscribed View -->
        <div id="subscribed" class="hidden">
            <span class="status-badge">✓ PREMIUM MEMBER</span>
            <div class="success-message">
                You have access to all premium features!
            </div>
            <button class="button" id="go-premium" style="margin-top: 15px;">
                Go to Premium Features
            </button>
        </div>
    </div>

    <!-- Firebase SDK v9+ (Modular) -->
    <script type="module">
        import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
        import { 
            getAuth, 
            signInWithPopup, 
            GoogleAuthProvider, 
            signOut, 
            onAuthStateChanged 
        } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
        import { 
            getFirestore, 
            doc, 
            onSnapshot 
        } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

        // Firebase Configuration
        const firebaseConfig = {
            apiKey: "AIzaSyA-1GRDCKGJjLgxiJZIxAM17ePm-bE_Qp8",
            authDomain: "studio-745534590-6183c.firebaseapp.com",
            projectId: "studio-745534590-6183c",
            storageBucket: "studio-745534590-6183c.appspot.com",
            messagingSenderId: "592403816115",
            appId: "1:592403816115:web:5970be1e0a407d8bc19ac6",
            measurementId: ""
        };

        // Initialize Firebase
        const app = initializeApp(firebaseConfig);
        const auth = getAuth(app);
        const db = getFirestore(app);

        // DOM Elements
        const elements = {
            signInButton: document.getElementById('sign-in-button'),
            signOutButton: document.getElementById('sign-out-button'),
            subscribeButton: document.getElementById('subscribe-button'),
            goPremiumButton: document.getElementById('go-premium'),
            loggedInDiv: document.getElementById('logged-in'),
            loggedOutDiv: document.getElementById('logged-out'),
            notSubscribedDiv: document.getElementById('not-subscribed'),
            subscribedDiv: document.getElementById('subscribed'),
            userEmailSpan: document.getElementById('user-email'),
            loginPrompt: document.getElementById('login-prompt')
        };

        // Sign in with Google
        elements.signInButton.addEventListener('click', async () => {
            const provider = new GoogleAuthProvider();
            try {
                await signInWithPopup(auth, provider);
            } catch (error) {
                console.error('Sign in error:', error);
                alert('Sign in failed: ' + error.message);
            }
        });

        // Sign out
        elements.signOutButton.addEventListener('click', async () => {
            try {
                await signOut(auth);
            } catch (error) {
                console.error('Sign out error:', error);
            }
        });

        // Go to premium features
        elements.goPremiumButton.addEventListener('click', () => {
            window.location.href = '/dashboard.html';
        });

        // Listen to subscription status
        let unsubscribeSnapshot = null;
        
        function listenToSubscriptionStatus(userId) {
            if (unsubscribeSnapshot) {
                unsubscribeSnapshot();
            }

            const userDocRef = doc(db, 'users', userId);
            unsubscribeSnapshot = onSnapshot(userDocRef, (docSnap) => {
                if (docSnap.exists()) {
                    const userData = docSnap.data();
                    const isPremium = userData.isPremium || false;
                    
                    if (isPremium) {
                        elements.notSubscribedDiv.classList.add('hidden');
                        elements.subscribedDiv.classList.remove('hidden');
                    } else {
                        elements.notSubscribedDiv.classList.remove('hidden');
                        elements.subscribedDiv.classList.add('hidden');
                    }
                }
            });
        }

        // Auth state observer
        onAuthStateChanged(auth, (user) => {
            if (user) {
                elements.loggedInDiv.classList.remove('hidden');
                elements.loggedOutDiv.classList.add('hidden');
                elements.userEmailSpan.textContent = user.email;
                elements.subscribeButton.style.opacity = '1';
                elements.subscribeButton.style.pointerEvents = 'auto';
                elements.loginPrompt.classList.add('hidden');
                
                listenToSubscriptionStatus(user.uid);
            } else {
                elements.loggedInDiv.classList.add('hidden');
                elements.loggedOutDiv.classList.remove('hidden');
                elements.subscribeButton.style.opacity = '0.6';
                elements.subscribeButton.style.pointerEvents = 'none';
                elements.notSubscribedDiv.classList.remove('hidden');
                elements.subscribedDiv.classList.add('hidden');
                elements.loginPrompt.classList.remove('hidden');
                
                if (unsubscribeSnapshot) {
                    unsubscribeSnapshot();
                }
            }
        });
    </script>
</body>
</html>

    