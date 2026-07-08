/**
 * SCORM 1.2 Native Wrapper for LMS Integration
 * Designed for Evolmind (evolCampus)
 * Handles API discovery, initialization, progress saving, scores and termination.
 */

const ScormWrapper = {
  api: null,
  isInitialized: false,
  debug: true,

  log(msg) {
    if (this.debug) {
      console.log(`[SCORM Wrapper] ${msg}`);
    }
  },

  // Search recursively for the SCORM API
  findAPI(win) {
    let findAttempts = 0;
    const maxAttempts = 50;

    while (win.API == null && win.parent != null && win.parent !== win) {
      findAttempts++;
      if (findAttempts > maxAttempts) {
        this.log("Error: Exceeded max API search depth.");
        return null;
      }
      win = win.parent;
    }
    return win.API;
  },

  getAPI() {
    if (this.api) return this.api;

    // Search window, parent windows, and opener windows
    let api = this.findAPI(window);

    if (!api && window.parent && window.parent !== window) {
      api = this.findAPI(window.parent);
    }
    if (!api && window.top && window.top.opener) {
      api = this.findAPI(window.top.opener);
    }
    if (!api && window.opener) {
      api = this.findAPI(window.opener);
    }

    if (api) {
      this.api = api;
      this.log("SCORM 1.2 API found.");
    } else {
      this.log("SCORM 1.2 API NOT found. Using Mock LocalStorage API for local testing.");
      this.api = this.createMockAPI();
    }
    return this.api;
  },

  // Initialize communication with LMS
  initialize() {
    if (this.isInitialized) return true;

    const api = this.getAPI();
    if (!api) return false;

    const result = api.LMSInitialize("");
    this.isInitialized = (result === "true");

    if (this.isInitialized) {
      this.log("LMSInitialize successful.");
      // If status is not set, initialize it to incomplete
      const status = this.getValue("cmi.core.lesson_status");
      if (status === "not attempted" || status === "unknown" || !status) {
        this.setValue("cmi.core.lesson_status", "incomplete");
        this.commit();
      }
    } else {
      this.log("LMSInitialize failed.");
    }

    return this.isInitialized;
  },

  // Get a value from LMS
  getValue(element) {
    if (!this.initialize()) return "";
    const value = this.api.LMSGetValue(element);
    this.log(`LMSGetValue('${element}') -> '${value}'`);
    return value;
  },

  // Set a value in LMS
  setValue(element, value) {
    if (!this.initialize()) return "false";
    this.log(`LMSSetValue('${element}', '${value}')`);
    return this.api.LMSSetValue(element, String(value));
  },

  // Commit changes to LMS
  commit() {
    if (!this.initialize()) return "false";
    this.log("LMSCommit");
    return this.api.LMSCommit("");
  },

  // Terminate communication with LMS
  terminate() {
    if (!this.isInitialized) return true;
    
    // Auto-commit on terminate
    this.commit();

    const result = this.api.LMSFinish("");
    const success = (result === "true");

    if (success) {
      this.log("LMSFinish successful.");
      this.isInitialized = false;
    } else {
      this.log("LMSFinish failed.");
    }

    return success;
  },

  // Mock API fallback for testing in local environment
  createMockAPI() {
    return {
      LMSInitialize(arg) {
        console.log("Mock: LMSInitialize");
        return "true";
      },
      LMSGetValue(element) {
        if (element === "cmi.core.student_name") {
          return localStorage.getItem(`mock_scorm_${element}`) || "Francisco Pérez García";
        }
        const val = localStorage.getItem(`mock_scorm_${element}`) || "";
        console.log(`Mock: LMSGetValue('${element}') -> '${val}'`);
        return val;
      },
      LMSSetValue(element, value) {
        console.log(`Mock: LMSSetValue('${element}', '${value}')`);
        localStorage.setItem(`mock_scorm_${element}`, String(value));
        return "true";
      },
      LMSCommit(arg) {
        console.log("Mock: LMSCommit");
        return "true";
      },
      LMSFinish(arg) {
        console.log("Mock: LMSFinish");
        return "true";
      }
    };
  }
};

// Auto-register unload handler
window.addEventListener("beforeunload", () => {
  ScormWrapper.terminate();
});
