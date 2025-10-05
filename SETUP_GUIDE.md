# 🚀 ClimoPilot Setup Guide

## 📋 Prerequisites

Before you start, make sure you have these installed:

### **Required Software:**
- **Python 3.11+** ([Download here](https://www.python.org/downloads/))
- **Node.js 16+** ([Download here](https://nodejs.org/))
- **Git** ([Download here](https://git-scm.com/downloads))

### **Check if you have them:**
```bash
python3 --version  # Should show Python 3.11+
node --version     # Should show v16+
npm --version      # Should show 6+
git --version      # Should show git version
```

---

## 🏃‍♂️ Quick Setup (5 minutes)

### **Step 1: Clone the Repository**
```bash
git clone https://github.com/Mathyaszzz/climopilot.git
cd climopilot
```

### **Step 2: Setup Backend**
```bash
# Install Python dependencies
pip install -r backend/requirements.txt

# Start the backend server
cd backend
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

**Keep this terminal open!** The backend should show:
```
INFO:     Uvicorn running on http://0.0.0.0:8000
INFO:     Started reloader process
```

### **Step 3: Setup Frontend (New Terminal)**
```bash
# Open a new terminal window/tab
cd frontend
npm install

# Start the frontend server
npm start
```

**Keep this terminal open too!** The frontend should open automatically in your browser at `http://localhost:3000`

---

## 🧪 Test It Works

### **Test Backend:**
```bash
curl http://localhost:8000/health
```
**Expected response:** `{"status":"ok"}`

### **Test Frontend:**
1. Open `http://localhost:3000` in your browser
2. You should see the ClimoPilot interface
3. Try selecting a location and date
4. Click "Analyze Weather"

---

## 🎯 Usage

1. **Select a location** using the map or search
2. **Choose a date** for analysis
3. **Click "Analyze Weather"** to see historical probabilities
4. **View results** in the popup with user-friendly explanations

---

## 🚨 Troubleshooting

### **Backend Issues:**

**Problem:** `ModuleNotFoundError: No module named 'fastapi'`
**Solution:** 
```bash
pip install -r backend/requirements.txt
```

**Problem:** `Port 8000 already in use`
**Solution:** 
```bash
# Kill any process using port 8000
lsof -ti:8000 | xargs kill -9
# Or use a different port
uvicorn main:app --reload --host 0.0.0.0 --port 8001
```

**Problem:** `python3: command not found`
**Solution:** Install Python 3.11+ from [python.org](https://www.python.org/downloads/)

### **Frontend Issues:**

**Problem:** `npm: command not found`
**Solution:** Install Node.js from [nodejs.org](https://nodejs.org/)

**Problem:** `Port 3000 already in use`
**Solution:** 
```bash
# Kill any process using port 3000
lsof -ti:3000 | xargs kill -9
# Or use a different port
PORT=3001 npm start
```

**Problem:** `react-scripts: command not found`
**Solution:** 
```bash
cd frontend
npm install
```

### **API Issues:**

**Problem:** Frontend shows "Failed to fetch weather data"
**Solution:** 
1. Make sure backend is running on port 8000
2. Check `http://localhost:8000/health` in browser
3. Check browser console for errors

**Problem:** Slow API responses
**Solution:** This is normal - NASA API can be slow. Wait 2-5 seconds.

---

## 📱 What You Should See

### **Backend Terminal:**
```
INFO:     Uvicorn running on http://0.0.0.0:8000
INFO:     Started reloader process
INFO:     Started server process
INFO:     Waiting for application startup.
INFO:     Application startup complete.
```

### **Frontend Terminal:**
```
Compiled successfully!

You can now view climopilot in the browser.

  Local:            http://localhost:3000
  On Your Network:  http://192.168.1.xxx:3000
```

### **Browser:**
- Clean, modern interface
- Interactive map
- Date picker
- "Analyze Weather" button
- Results popup with probabilities

---

## 🎯 Example Test

Try this to verify everything works:

1. **Select location:** Phoenix, Arizona
2. **Select date:** July 15th
3. **Click "Analyze Weather"**
4. **Expected results:** High heat probability (~98%), low cold/wet/wind

---

## 📞 Need Help?

If you run into issues:

1. **Check the troubleshooting section above**
2. **Make sure both servers are running**
3. **Check the browser console for errors**
4. **Verify all prerequisites are installed**

---

## 🎉 Success!

If you can see the ClimoPilot interface and get weather results, you're all set! The app is now running locally and ready to use.

**Enjoy exploring NASA's climate data!** 🚀
