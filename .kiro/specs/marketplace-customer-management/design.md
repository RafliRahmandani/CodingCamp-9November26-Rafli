# Design Document: Sistem Manajemen Pelanggan Marketplace Indonesia

## Overview

### Purpose
This design specifies the technical architecture for converting a Google Apps Script-based customer management system into a standalone client-side web application. The system enables Indonesian marketplace vendors to manage customer transaction data using only browser technologies (HTML, CSS, vanilla JavaScript) with LocalStorage for persistence.

### Key Design Principles
1. **Zero Backend Dependency**: All functionality executes client-side; no server required beyond static file hosting
2. **Modular Architecture**: [IIFE module pattern](https://www.patterns.dev/vanilla/module-pattern/) creates encapsulated components with private state and public APIs
3. **Data Sovereignty**: All data resides in browser LocalStorage under user control
4. **Progressive Enhancement**: Core functionality works on all modern browsers with graceful degradation
5. **Indonesian-First Interface**: All UI text, messages, and formats use Indonesian language and conventions

### System Context
The application replaces a Google Apps Script solution with constraints:
- **No frameworks allowed** (React, Vue, Angular) - only vanilla JavaScript
- **Single external library**: Chart.js for data visualizations
- **Deployment target**: GitHub Pages static hosting
- **Browser support**: Chrome 90+, Firefox 88+, Edge 90+, Safari 14+
- **Storage**: Browser LocalStorage (5-10MB quota typical)

### Success Criteria
- Handles 1000+ customer records without performance degradation
- Page loads within 2 seconds on 10 Mbps connection
- Dashboard KPIs calculate and render within 1 second
- Charts render within 2 seconds
- Form submission provides feedback within 500ms
- Responsive design functions on screens 320px - 1920px wide

---

## Architecture

### High-Level Architecture

```mermaid
graph TB
    subgraph Browser["Browser Environment"]
        subgraph UI["User Interface Layer"]
            LoginUI[Login Component]
            NavUI[Navigation Component]
            FormUI[Transaction Form]
            SearchUI[Search Component]
            DashUI[Dashboard Component]
            AnalyticsUI[Analytics Component]
            ExportUI[Export/Import UI]
        end
        
        subgraph Core["Core Logic Layer"]
            AuthMgr[Auth Manager]
            CustMgr[Customer Manager]
            ValEngine[Validation Engine]
            CalcEngine[Calculation Engine]
            ChartMgr[Chart Manager]
            NavMgr[Navigation Manager]
        end
        
        subgraph Storage["Storage Layer"]
            StorageAPI[Storage API Wrapper]
            LocalStorage[(LocalStorage)]
        end
        
        subgraph External["External Dependencies"]
            ChartJS[Chart.js Library]
        end
    end
    
    UI --> Core
    Core --> Storage
    Storage --> LocalStorage
    AnalyticsUI --> ChartJS
    ChartMgr --> ChartJS
    
    style Browser fill:#f9f9f9
    style UI fill:#e3f2fd
    style Core fill:#fff3e0
    style Storage fill:#e8f5e9
    style External fill:#fce4ec
