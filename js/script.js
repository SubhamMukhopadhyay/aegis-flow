/**
 * Aegis Hackathon Control Center — Command Engine
 * Linear + Vercel + Raycast Ergonomics with Liquid Glass Physics
 * 
 * Features:
 * - Dynamic Canvas Ambient Fluid System with slow atmospheric drift
 * - Raycast-Style Command Palette (Ctrl+K or /) with keyboard navigation
 * - 4-Column Kanban Pipeline (To Do, In Progress, Review, Done) with Drag & Drop
 * - Real-time countdown targeting October 10, 2026, 23:59:59 GMT+5:30
 * - Horizontal Hackathon milestone schedule
 * - Interactive Demo Readiness checklist
 * - Quick Notes workspace with pinning and color swatches
 * - Real-time Activity Center audit feed
 * - Confirmation dialogs for destructive actions
 * - Full localStorage persistence and demo state restore
 */

(function () {
  'use strict';

  // --- STORAGE KEYS ---
  const STORAGE_KEYS = {
    TASKS: 'aegis_tasks_v3',
    DEADLINE: 'aegis_deadline_v3',
    NOTES: 'aegis_notes_v3',
    CHECKLIST: 'aegis_checklist_v3',
    ACTIVITY: 'aegis_activity_v3',
    ACTIVITY_FILTER: 'aegis_activity_filter_v1',
    BOARD_FILTER: 'aegis_board_filter_v1',
    REMINDERS: 'aegis_reminders_v1'
  };

  // --- DEFAULT DEADLINE: OCTOBER 10, 2026 AT 23:59:59 GMT+5:30 ---
  const DEFAULT_DEADLINE_ISO = '2026-10-10T23:59:59+05:30';

  // --- DEFAULT SAMPLE DATA ---
  const DEFAULT_TASKS = [
    {
      id: 'task-1',
      title: 'Design high-fidelity design system & dark glass tokens',
      description: 'Create cohesive palette, typography hierarchy, and fluid interactive components inspired by Linear & Raycast.',
      status: 'done',
      priority: 'high',
      tag: 'Design',
      assignee: 'Subham'
    },
    {
      id: 'task-2',
      title: 'Setup repository, CI/CD pipeline & automated preview',
      description: 'Configure GitHub Actions, automated test suites, linting rules, and deploy staging URL on edge network.',
      status: 'done',
      priority: 'medium',
      tag: 'Backend',
      assignee: 'Kartik'
    },
    {
      id: 'task-3',
      title: 'Integrate real-time streaming LLM agent coordinator',
      description: 'Implement WebSocket backoff pipeline, structured JSON output validation, and streaming token parser via Wispr Flow.',
      status: 'review',
      priority: 'urgent',
      tag: 'AI / ML',
      assignee: 'Subham'
    },
    {
      id: 'task-4',
      title: 'Develop 4-stage Kanban pipeline with drag and drop',
      description: 'Build responsive columns for To Do, In Progress, Review, and Done with smooth drag feedback and mobile step controls.',
      status: 'in-progress',
      priority: 'high',
      tag: 'Frontend',
      assignee: 'Subham'
    },
    {
      id: 'task-5',
      title: 'Synthesize benchmark datasets & edge-case stress vectors',
      description: 'Generate 1,000 synthetic test interactions to demonstrate sub-50ms latency during judge review.',
      status: 'in-progress',
      priority: 'medium',
      tag: 'AI / ML',
      assignee: 'Kartik'
    },
    {
      id: 'task-6',
      title: 'Draft 3-minute pitch deck & architectural narrative',
      description: 'Highlight real-world problem, defensibility, technical differentiation, and developer productivity impact.',
      status: 'todo',
      priority: 'urgent',
      tag: 'Pitch Deck',
      assignee: 'Team Kohinoor'
    },
    {
      id: 'task-7',
      title: 'Record & edit 2-minute Loom product walkthrough video',
      description: 'Capture end-to-end user workflow, latency benchmarks, and voiceover explanation for final submission.',
      status: 'todo',
      priority: 'high',
      tag: 'Pitch Deck',
      assignee: 'Sharandeep Singh'
    },
    {
      id: 'task-8',
      title: 'Tune Wispr Flow voice prompt parser for live sprint command macros',
      description: 'Calibrate hands-free voice intent recognition for real-time task generation, state changes, and sprint updates.',
      status: 'in-progress',
      priority: 'high',
      tag: 'AI / ML',
      assignee: 'Subham'
    },
    {
      id: 'task-9',
      title: 'Configure production CDN caching and SSL certificates for fast edge delivery',
      description: 'Optimize asset compression, edge headers, and route fallbacks to guarantee instant load times across all devices.',
      status: 'todo',
      priority: 'high',
      tag: 'Backend',
      assignee: 'Kartik'
    },
    {
      id: 'task-10',
      title: 'Launch Edisflow Sprint',
      description: 'Coordinate final sprint release milestones, verify live deployments, and initiate the Edisflow sprint cycle.',
      status: 'todo',
      priority: 'urgent',
      tag: 'Backend',
      assignee: 'Kartik'
    },
    {
      id: 'task-11',
      title: 'Deploy final sprint release',
      description: 'Trigger production edge deployment, verify domain certificates, and lock final release build.',
      status: 'todo',
      priority: 'urgent',
      tag: 'Backend',
      assignee: 'Subham'
    }
  ];

  const DEFAULT_NOTES = [
    {
      id: 'note-1',
      title: 'Judge Evaluation Criteria Weights',
      content: '1. Technical execution & stability (40%)\n2. Practical impact & problem depth (30%)\n3. UX polish & presentation flow (30%)',
      color: 'violet',
      isPinned: true,
      date: 'Oct 2, 2:15 PM'
    },
    {
      id: 'note-2',
      title: 'AI Streaming Pipeline Notes',
      content: 'Keep chunk parser non-blocking to prevent UI stutters. Use indexed caching for prompt embeddings.',
      color: 'cyan',
      isPinned: true,
      date: 'Oct 2, 4:40 PM'
    },
    {
      id: 'note-3',
      title: '30-Second Elevator Pitch Hook',
      content: '"Developers spend 30% of hackathons coordinating status instead of shipping. Aegis automates sprint velocity with zero overhead."',
      color: 'magenta',
      isPinned: false,
      date: 'Oct 2, 6:10 PM'
    }
  ];

  const DEFAULT_CHECKLIST = [
    { id: 'check-1', label: 'Public GitHub Repository', sub: 'Comprehensive README, architecture diagrams, and setup instructions', completed: true },
    { id: 'check-2', label: 'Live Deployment URL', sub: 'Verified HTTPS endpoint accessible without login friction', completed: true },
    { id: 'check-3', label: 'Model & Latency Benchmark Documentation', sub: 'Sub-50ms vector verification proofs and load stats', completed: false },
    { id: 'check-4', label: '3-Minute Slide Deck', sub: 'Problem statement, solution flow, business impact, team credentials', completed: false },
    { id: 'check-5', label: 'Demo Video & Devpost Submission', sub: 'Sub-3 min video walkthrough uploaded and Devpost locked', completed: false }
  ];

  const DEFAULT_ACTIVITY = [
    { id: 'act-1', text: 'System initialized sprint pipeline <strong>v4.2</strong>', type: 'cyan', time: '10m ago', action: 'created' },
    { id: 'act-2', text: 'Task <strong>Integrate real-time streaming LLM</strong> moved to <strong>Review</strong>', type: 'violet', time: '25m ago', action: 'moved' },
    { id: 'act-3', text: 'Milestone <strong>Core Engine Build</strong> marked as completed', type: 'emerald', time: '1h ago', action: 'completed' },
    { id: 'act-4', text: 'Target deadline synchronized to <strong>Oct 10, 2026, 23:59 GMT+5:30</strong>', type: 'amber', time: '2h ago', action: 'edited' }
  ];

  // --- STATE ---
  let tasks = [];
  let notes = [];
  let checklist = [];
  let activity = [];
  let reminders = [];
  let deadline = null;
  let countdownInterval = null;
  let activeFilter = 'all';
  let activityFilter = 'all';
  let searchQuery = '';
  let pendingConfirmAction = null;

  // --- DOM REFERENCES ---
  const dom = {
    // Canvas
    ambientCanvas: document.getElementById('ambientCanvas'),
    projectCoreCanvas: document.getElementById('projectCoreCanvas'),
    corePercentText: document.getElementById('corePercentText'),
    coreStateText: document.getElementById('coreStateText'),

    // Sidebar & Navigation
    sidebar: document.getElementById('sidebar'),
    sidebarBackdrop: document.getElementById('sidebarBackdrop'),
    mobileMenuBtn: document.getElementById('mobileMenuBtn'),
    mobilePaletteBtn: document.getElementById('mobilePaletteBtn'),
    sidebarCommandBtn: document.getElementById('sidebarCommandBtn'),
    openCommandPaletteBtn: document.getElementById('openCommandPaletteBtn'),
    navTaskCount: document.getElementById('navTaskCount'),
    navNotesCount: document.getElementById('navNotesCount'),
    navReadinessBadge: document.getElementById('navReadinessBadge'),
    sidebarProgressValue: document.getElementById('sidebarProgressValue'),
    sidebarProgressBar: document.getElementById('sidebarProgressBar'),
    sidebarProgressSubtitle: document.getElementById('sidebarProgressSubtitle'),
    resetDemoBtn: document.getElementById('resetDemoBtn'),

    // Top Navigation
    globalSearchInput: document.getElementById('globalSearchInput'),
    openNewTaskModalBtn: document.getElementById('openNewTaskModalBtn'),
    openNewNoteModalBtn: document.getElementById('openNewNoteModalBtn'),
    openReminderCenterBtn: document.getElementById('openReminderCenterBtn'),
    reminderCountBadge: document.getElementById('reminderCountBadge'),

    // Hero Section
    displayDeadlineShort: document.getElementById('displayDeadlineShort'),
    displayDeadlineString: document.getElementById('displayDeadlineString'),
    timelineDeadlineText: document.getElementById('timelineDeadlineText'),
    topHealthText: document.getElementById('topHealthText'),
    heroHealthText: document.getElementById('heroHealthText'),
    activeTasksContext: document.getElementById('activeTasksContext'),
    readinessContext: document.getElementById('readinessContext'),
    openTasksContext: document.getElementById('openTasksContext'),
    shipCompletion: document.getElementById('shipCompletion'),
    shipReadiness: document.getElementById('shipReadiness'),
    shipActive: document.getElementById('shipActive'),
    shipRemaining: document.getElementById('shipRemaining'),
    shipDeadline: document.getElementById('shipDeadline'),
    shipStatus: document.getElementById('shipStatus'),
    openDeadlineModalBtn: document.getElementById('openDeadlineModalBtn'),
    timerDays: document.getElementById('timerDays'),
    timerHours: document.getElementById('timerHours'),
    timerMinutes: document.getElementById('timerMinutes'),
    timerSeconds: document.getElementById('timerSeconds'),
    kpiPercent: document.getElementById('kpiPercent'),
    kpiCompletedFraction: document.getElementById('kpiCompletedFraction'),
    kpiProgressBar: document.getElementById('kpiProgressBar'),
    kpiInProgress: document.getElementById('kpiInProgress'),
    kpiReview: document.getElementById('kpiReview'),
    kpiTodo: document.getElementById('kpiTodo'),

    // Kanban Board
    boardQuickAddTaskBtn: document.getElementById('boardQuickAddTaskBtn'),
    exportTasksBtn: document.getElementById('exportTasksBtn'),
    filterCountAll: document.getElementById('filterCountAll'),
    filterPills: document.querySelectorAll('.board-filter-toolbar .filter-pill'),
    countTodo: document.getElementById('count-todo'),
    countInProgress: document.getElementById('count-in-progress'),
    countReview: document.getElementById('count-review'),
    countDone: document.getElementById('count-done'),
    cardsTodo: document.getElementById('cards-todo'),
    cardsInProgress: document.getElementById('cards-in-progress'),
    cardsReview: document.getElementById('cards-review'),
    cardsDone: document.getElementById('cards-done'),

    // Readiness
    readinessScoreText: document.getElementById('readinessScoreText'),
    readinessFractionText: document.getElementById('readinessFractionText'),
    checklistContainer: document.getElementById('checklistContainer'),

    // Notes
    notesGrid: document.getElementById('notesGrid'),
    addNoteTriggerBtn: document.getElementById('addNoteTriggerBtn'),

    // Activity
    activityStreamContainer: document.getElementById('activityStreamContainer'),
    clearActivityBtn: document.getElementById('clearActivityBtn'),
    exportActivityBtn: document.getElementById('exportActivityBtn'),

    // Command Palette
    commandPalette: document.getElementById('commandPalette'),
    paletteSearchInput: document.getElementById('paletteSearchInput'),
    paletteResultsList: document.getElementById('paletteResultsList'),

    // Modals
    taskModal: document.getElementById('taskModal'),
    taskModalTitle: document.getElementById('taskModalTitle'),
    taskForm: document.getElementById('taskForm'),
    taskFormId: document.getElementById('taskFormId'),
    taskTitleInput: document.getElementById('taskTitleInput'),
    taskDescInput: document.getElementById('taskDescInput'),
    taskStatusSelect: document.getElementById('taskStatusSelect'),
    modalStageSwitcher: document.getElementById('modalStageSwitcher'),
    taskPrioritySelect: document.getElementById('taskPrioritySelect'),
    taskTagSelect: document.getElementById('taskTagSelect'),
    taskAssigneeInput: document.getElementById('taskAssigneeInput'),
    closeTaskModalBtn: document.getElementById('closeTaskModalBtn'),
    cancelTaskBtn: document.getElementById('cancelTaskBtn'),

    noteModal: document.getElementById('noteModal'),
    noteModalTitle: document.getElementById('noteModalTitle'),
    noteForm: document.getElementById('noteForm'),
    noteFormId: document.getElementById('noteFormId'),
    noteTitleInput: document.getElementById('noteTitleInput'),
    noteBodyInput: document.getElementById('noteBodyInput'),
    notePinnedInput: document.getElementById('notePinnedInput'),
    closeNoteModalBtn: document.getElementById('closeNoteModalBtn'),
    cancelNoteBtn: document.getElementById('cancelNoteBtn'),

    deadlineModal: document.getElementById('deadlineModal'),
    deadlineForm: document.getElementById('deadlineForm'),
    deadlineDatetimeInput: document.getElementById('deadlineDatetimeInput'),
    presetDefaultBtn: document.getElementById('presetDefaultBtn'),
    closeDeadlineModalBtn: document.getElementById('closeDeadlineModalBtn'),
    cancelDeadlineBtn: document.getElementById('cancelDeadlineBtn'),

    // Confirm Dialog
    confirmModal: document.getElementById('confirmModal'),
    confirmModalTitle: document.getElementById('confirmModalTitle'),
    confirmModalDesc: document.getElementById('confirmModalDesc'),
    confirmCancelBtn: document.getElementById('confirmCancelBtn'),
    confirmProceedBtn: document.getElementById('confirmProceedBtn'),

    reminderCenterModal: document.getElementById('reminderCenterModal'),
    reminderCenterTitle: document.getElementById('reminderCenterTitle'),
    reminderList: document.getElementById('reminderList'),
    closeReminderCenterBtn: document.getElementById('closeReminderCenterBtn'),
    enableNotificationsBtn: document.getElementById('enableNotificationsBtn'),
    reminderPermissionStatus: document.getElementById('reminderPermissionStatus'),
    newReminderBtn: document.getElementById('newReminderBtn'),
    reminderModal: document.getElementById('reminderModal'),
    reminderModalTitle: document.getElementById('reminderModalTitle'),
    reminderForm: document.getElementById('reminderForm'),
    reminderFormId: document.getElementById('reminderFormId'),
    reminderTitleInput: document.getElementById('reminderTitleInput'),
    reminderDateInput: document.getElementById('reminderDateInput'),
    reminderRepeatSelect: document.getElementById('reminderRepeatSelect'),
    reminderTaskSelect: document.getElementById('reminderTaskSelect'),
    closeReminderModalBtn: document.getElementById('closeReminderModalBtn'),
    cancelReminderBtn: document.getElementById('cancelReminderBtn'),
    reminderNaturalInput: document.getElementById('reminderNaturalInput'),
    interpretReminderBtn: document.getElementById('interpretReminderBtn'),
    aiReminderPreview: document.getElementById('aiReminderPreview'),
    aiReminderSummary: document.getElementById('aiReminderSummary'),
    confirmAiReminderBtn: document.getElementById('confirmAiReminderBtn'),

    // Toast
    toastContainer: document.getElementById('toastContainer')
  };

  // --- INITIALIZATION ---
  function init() {
    loadData();
    initAmbientCanvas();
    initProjectCore();
    setupEventListeners();
    setupKanbanDragAndDrop();
    initCommandPalette();
    initModalStageSwitcher();
    initSectionReveal();
    startCountdownTimer();
    renderAll();
    initReminderSystem();
  }

  function initSectionReveal() {
    if (!('IntersectionObserver' in window)) return;
    const storyLinks = [...document.querySelectorAll('.story-nav a')];
    const navTargets = document.querySelectorAll('.content-container > section');
    const navObserver = new IntersectionObserver((entries) => {
      const active = entries.filter(entry => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!active) return;
      const sectionId = active.target.id === 'readiness-section' ? 'timeline-section'
        : active.target.id === 'notes-section' ? 'board-section' : active.target.id;
      storyLinks.forEach(link => {
        const isActive = link.getAttribute('href') === `#${sectionId}`;
        link.classList.toggle('active', isActive);
        if (isActive) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    }, { threshold: [0.05, 0.15], rootMargin: '-38% 0px -52% 0px' });
    navTargets.forEach(section => navObserver.observe(section));
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const sections = document.querySelectorAll('.content-container > section:not(#overview)');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -35px 0px' });
    sections.forEach(section => {
      section.classList.add('motion-enter');
      observer.observe(section);
    });
  }

  // --- LOCALSTORAGE PERSISTENCE ---
  function loadData() {
    try {
      const storedTasks = localStorage.getItem(STORAGE_KEYS.TASKS);
      if (storedTasks === null) {
        // First visit with no saved data: populate with demo tasks so the board is never empty
        tasks = JSON.parse(JSON.stringify(DEFAULT_TASKS));
        saveTasks();
      } else {
        try {
          const parsedTasks = JSON.parse(storedTasks);
          tasks = Array.isArray(parsedTasks) ? parsedTasks : JSON.parse(JSON.stringify(DEFAULT_TASKS));
          // Migrate demo tasks with legacy names to Subham and Kartik
          let updatedAssignees = false;
          tasks.forEach(t => {
            if (t.id === 'task-1' && (t.assignee === 'Elena Rostova' || !t.assignee)) {
              t.assignee = 'Subham';
              updatedAssignees = true;
            }
            if (t.id === 'task-2' && (t.assignee === 'Marcus Chen' || !t.assignee)) {
              t.assignee = 'Kartik';
              updatedAssignees = true;
            }
            if (t.id === 'task-3' && (t.assignee === 'Devon K.' || !t.assignee)) {
              t.assignee = 'Subham';
              updatedAssignees = true;
            }
            if (t.id === 'task-4' && (t.assignee === 'Elena Rostova' || !t.assignee)) {
              t.assignee = 'Subham';
              updatedAssignees = true;
            }
            if (t.id === 'task-5' && (t.assignee === 'Devon K.' || !t.assignee)) {
              t.assignee = 'Kartik';
              updatedAssignees = true;
            }
            if (t.id === 'task-7' && (t.assignee === 'Sarah Lin' || !t.assignee)) {
              t.assignee = 'Sharandeep Singh';
              updatedAssignees = true;
            }
          });

          // Ensure task-8 (Subham - high priority) and task-9 (Kartik - high priority) exist
          if (!tasks.some(t => t.id === 'task-8')) {
            const task8 = DEFAULT_TASKS.find(t => t.id === 'task-8');
            if (task8) {
              tasks.push(JSON.parse(JSON.stringify(task8)));
              updatedAssignees = true;
            }
          }
          if (!tasks.some(t => t.id === 'task-9')) {
            const task9 = DEFAULT_TASKS.find(t => t.id === 'task-9');
            if (task9) {
              tasks.push(JSON.parse(JSON.stringify(task9)));
              updatedAssignees = true;
            }
          }
          if (!tasks.some(t => t.id === 'task-10')) {
            const task10 = DEFAULT_TASKS.find(t => t.id === 'task-10');
            if (task10) {
              tasks.push(JSON.parse(JSON.stringify(task10)));
              updatedAssignees = true;
            }
          }
          if (!tasks.some(t => t.id === 'task-11')) {
            const task11 = DEFAULT_TASKS.find(t => t.id === 'task-11');
            if (task11) {
              tasks.push(JSON.parse(JSON.stringify(task11)));
              updatedAssignees = true;
            }
          }

          if (updatedAssignees) saveTasks();
        } catch (e) {
          tasks = JSON.parse(JSON.stringify(DEFAULT_TASKS));
          saveTasks();
        }
      }

      const storedDeadline = localStorage.getItem(STORAGE_KEYS.DEADLINE);
      if (!storedDeadline || storedDeadline.startsWith('2026-10-06')) {
        deadline = new Date(DEFAULT_DEADLINE_ISO);
        saveDeadline();
      } else {
        deadline = new Date(storedDeadline);
      }

      const storedNotes = localStorage.getItem(STORAGE_KEYS.NOTES);
      if (storedNotes === null) {
        // First visit with no saved notes: populate with demo notes
        notes = JSON.parse(JSON.stringify(DEFAULT_NOTES));
        saveNotes();
      } else {
        try {
          const parsedNotes = JSON.parse(storedNotes);
          notes = Array.isArray(parsedNotes) ? parsedNotes : JSON.parse(JSON.stringify(DEFAULT_NOTES));
        } catch (e) {
          notes = JSON.parse(JSON.stringify(DEFAULT_NOTES));
          saveNotes();
        }
      }

      const storedChecklist = localStorage.getItem(STORAGE_KEYS.CHECKLIST);
      if (storedChecklist === null) {
        checklist = JSON.parse(JSON.stringify(DEFAULT_CHECKLIST));
        saveChecklist();
      } else {
        try {
          checklist = JSON.parse(storedChecklist);
        } catch (e) {
          checklist = JSON.parse(JSON.stringify(DEFAULT_CHECKLIST));
        }
      }

      const storedActivity = localStorage.getItem(STORAGE_KEYS.ACTIVITY);
      if (storedActivity === null) {
        activity = JSON.parse(JSON.stringify(DEFAULT_ACTIVITY));
        saveActivity();
      } else {
        try {
          const parsed = JSON.parse(storedActivity);
          activity = Array.isArray(parsed) ? parsed : JSON.parse(JSON.stringify(DEFAULT_ACTIVITY));
        } catch (e) {
          activity = JSON.parse(JSON.stringify(DEFAULT_ACTIVITY));
        }
      }

      const storedActivityFilter = localStorage.getItem(STORAGE_KEYS.ACTIVITY_FILTER);
      if (storedActivityFilter && ['all', 'created', 'edited', 'moved', 'completed', 'deleted'].includes(storedActivityFilter)) {
        activityFilter = storedActivityFilter;
      } else {
        activityFilter = 'all';
      }

      if (activity.length === 0) {
        activityFilter = 'all';
        saveActivityFilter();
      }

      const storedBoardFilter = localStorage.getItem(STORAGE_KEYS.BOARD_FILTER);
      if (storedBoardFilter && ['all', 'urgent', 'frontend', 'backend', 'pitch'].includes(storedBoardFilter)) {
        activeFilter = storedBoardFilter;
      } else {
        activeFilter = 'all';
      }

      try {
        const storedReminders = localStorage.getItem(STORAGE_KEYS.REMINDERS);
        reminders = storedReminders ? JSON.parse(storedReminders) : [];
      } catch (error) {
        console.warn('Error loading reminders:', error);
        reminders = [];
      }
    } catch (e) {
      console.warn('Error loading localStorage:', e);
      tasks = JSON.parse(JSON.stringify(DEFAULT_TASKS));
      deadline = new Date(DEFAULT_DEADLINE_ISO);
      notes = JSON.parse(JSON.stringify(DEFAULT_NOTES));
      checklist = JSON.parse(JSON.stringify(DEFAULT_CHECKLIST));
      activity = JSON.parse(JSON.stringify(DEFAULT_ACTIVITY));
      activityFilter = 'all';
      reminders = [];
      saveTasks();
      saveNotes();
    }
  }

  function saveTasks() {
    try { localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks)); } catch (e) { console.error(e); }
  }

  function saveDeadline() {
    try { localStorage.setItem(STORAGE_KEYS.DEADLINE, deadline.toISOString()); } catch (e) { console.error(e); }
  }

  function saveNotes() {
    try { localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(notes)); } catch (e) { console.error(e); }
  }

  function saveChecklist() {
    try { localStorage.setItem(STORAGE_KEYS.CHECKLIST, JSON.stringify(checklist)); } catch (e) { console.error(e); }
  }

  function saveActivity() {
    try { localStorage.setItem(STORAGE_KEYS.ACTIVITY, JSON.stringify(activity)); } catch (e) { console.error(e); }
  }

  function saveActivityFilter() {
    try { localStorage.setItem(STORAGE_KEYS.ACTIVITY_FILTER, activityFilter); } catch (e) { console.error(e); }
  }

  function saveBoardFilter() {
    try { localStorage.setItem(STORAGE_KEYS.BOARD_FILTER, activeFilter); } catch (e) { console.error(e); }
  }

  function saveReminders() {
    try { localStorage.setItem(STORAGE_KEYS.REMINDERS, JSON.stringify(reminders)); } catch (e) { console.error(e); }
  }

  function inferActivityAction(text) {
    const raw = (text || '').toLowerCase();
    if (raw.includes('created') || raw.includes('initialized')) return 'created';
    if (raw.includes('deleted') || raw.includes('removed')) return 'deleted';
    if (raw.includes('completed') || raw.includes('verified') || raw.includes('marked as completed') || raw.includes('to <strong>done</strong>')) return 'completed';
    if (raw.includes('moved') || raw.includes('stepped')) return 'moved';
    if (raw.includes('updated') || raw.includes('synchronized') || raw.includes('edited') || raw.includes('unchecked')) return 'edited';
    return 'edited';
  }

  function logActivity(text, type = 'cyan', action = null) {
    const resolvedAction = action || inferActivityAction(text);
    const newEntry = {
      id: 'act-' + Date.now(),
      text,
      type,
      time: 'Just now',
      timestamp: Date.now(),
      action: resolvedAction
    };
    activity.unshift(newEntry);
    if (activity.length > 20) activity.pop();
    saveActivity();

    // If current filter would hide this new activity, switch back to 'all' so it is immediately visible
    if (activityFilter !== 'all' && activityFilter !== resolvedAction) {
      activityFilter = 'all';
      saveActivityFilter();
    }

    renderActivity();
  }

  function resetToDefaults() {
    askConfirmation({
      title: 'Reset Demo State?',
      desc: 'This will restore initial hackathon sample data, replacing any custom tasks, notes, reminders, or deadline settings.',
      confirmLabel: 'Restore Demo',
      onConfirm: () => {
        tasks = JSON.parse(JSON.stringify(DEFAULT_TASKS));
        deadline = new Date(DEFAULT_DEADLINE_ISO);
        notes = JSON.parse(JSON.stringify(DEFAULT_NOTES));
        checklist = JSON.parse(JSON.stringify(DEFAULT_CHECKLIST));
        activity = JSON.parse(JSON.stringify(DEFAULT_ACTIVITY));
        activityFilter = 'all';
        activeFilter = 'all';
        reminders = [];

        saveTasks();
        saveDeadline();
        saveNotes();
        saveChecklist();
        saveActivity();
        saveActivityFilter();
        saveBoardFilter();
        saveReminders();

        renderAll();
        renderReminderCenter();
        showToast('Demo state successfully restored', 'toast-info');
      }
    });
  }

  // --- DYNAMIC AMBIENT FLUID CANVAS BACKGROUND ---
  function initAmbientCanvas() {
    const canvas = dom.ambientCanvas;
    if (!canvas) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      canvas.style.display = 'none';
      return;
    }
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }, { passive: true });

    // Metaballs configuration
    const blobs = [
      { x: width * 0.24, y: height * 0.22, vx: 0.11, vy: 0.08, r: 330, color: 'rgba(67, 153, 148, 0.055)' },
      { x: width * 0.78, y: height * 0.68, vx: -0.08, vy: -0.1, r: 390, color: 'rgba(112, 153, 142, 0.04)' }
    ];

    function draw() {
      if (document.hidden) {
        requestAnimationFrame(draw);
        return;
      }

      ctx.clearRect(0, 0, width, height);

      // Draw floating fluid blobs
      blobs.forEach((b) => {
        b.x += b.vx;
        b.y += b.vy;

        // Soft bounce boundaries
        if (b.x < -100 || b.x > width + 100) b.vx *= -1;
        if (b.y < -100 || b.y > height + 100) b.vy *= -1;

        const g = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r);
        g.addColorStop(0, b.color);
        g.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        ctx.fill();
      });

      requestAnimationFrame(draw);
    }

    draw();
  }

  function initProjectCore() {
    const canvas = dom.projectCoreCanvas;
    const ctx = canvas && canvas.getContext('2d');
    if (!ctx) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
    let width = 0;
    let height = 0;
    let dpr = 1;
    let frame = 0;
    let phase = 0;
    let inView = true;
    const particles = Array.from({ length: 12 }, (_, i) => ({
      angle: i * 2.399,
      radius: 0.16 + ((i * 37) % 67) / 100,
      speed: 0.00012 + (i % 5) * 0.000025,
      size: 0.45 + (i % 4) * 0.28
    }));

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 1.6);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    new ResizeObserver(resize).observe(canvas);

    canvas.addEventListener('pointermove', (event) => {
      const rect = canvas.getBoundingClientRect();
      pointer.tx = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
      pointer.ty = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
    }, { passive: true });
    canvas.addEventListener('pointerleave', () => { pointer.tx = 0; pointer.ty = 0; }, { passive: true });

    function draw(now) {
      frame = 0;
      if (document.hidden || !width || !height || (!inView && !reducedMotion)) return;
      if (!reducedMotion) phase = now * 0.00018;
      if (reducedMotion) {
        pointer.x = 0;
        pointer.y = 0;
      } else {
        pointer.x += (pointer.tx - pointer.x) * 0.025;
        pointer.y += (pointer.ty - pointer.y) * 0.025;
      }
      ctx.clearRect(0, 0, width, height);

      const done = tasks.length ? tasks.filter(task => task.status === 'done').length / tasks.length : 0;
      const active = tasks.filter(task => task.status === 'in-progress' || task.status === 'review').length;
      const remaining = tasks.filter(task => task.status !== 'done').length;
      const ready = checklist.length ? checklist.filter(item => item.completed).length / checklist.length : 0;
      const hoursLeft = deadline ? (deadline.getTime() - Date.now()) / 3600000 : 0;
      const urgency = hoursLeft <= 0 ? 1 : Math.max(0, Math.min(1, 1 - hoursLeft / (24 * 5)));
      const health = Math.max(0, Math.min(1, done * 0.45 + ready * 0.35 + (tasks.length ? active / tasks.length : 0) * 0.2));
      const workload = tasks.length ? remaining / tasks.length : 0;
      const activity = tasks.length ? active / tasks.length : 0;
      const drift = reducedMotion ? 0 : Math.sin(phase * 0.24) * width * 0.018;
      const atmosphere = ctx.createRadialGradient(width * 0.63 + drift, height * 0.51, 1, width * 0.62 + drift, height * 0.5, Math.max(width, height) * 0.78);
      atmosphere.addColorStop(0, `rgba(137,155,119,${0.036 + health * 0.008 + activity * 0.003 + urgency * 0.002 + workload * 0.001})`);
      atmosphere.addColorStop(0.48, 'rgba(75,91,63,0.018)');
      atmosphere.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = atmosphere;
      ctx.fillRect(0, 0, width, height);

      for (const p of particles) {
        const a = p.angle + phase * p.speed * 8500;
        const px = width * (0.38 + p.radius * 0.56) + pointer.x * 3;
        const py = height * 0.5 + Math.sin(a + px / Math.max(width, 1) * 3) * height * 0.09 + pointer.y * 3;
        ctx.beginPath();
        ctx.fillStyle = `rgba(205,216,190,${0.025 + (1 - p.radius) * 0.035})`;
        ctx.arc(px, py, Math.min(p.size, 0.65), 0, Math.PI * 2);
        ctx.fill();
      }
      if (!reducedMotion) frame = requestAnimationFrame(draw);
    }
    const scheduleDraw = () => {
      if (!frame && !document.hidden && width && height) frame = requestAnimationFrame(draw);
    };
    if ('IntersectionObserver' in window) {
      const visibilityObserver = new IntersectionObserver(([entry]) => {
        inView = entry.isIntersecting;
        if (inView) scheduleDraw();
      }, { threshold: 0.01 });
      visibilityObserver.observe(canvas);
    }
    scheduleDraw();
    document.addEventListener('visibilitychange', () => {
      if (document.hidden && frame) {
        cancelAnimationFrame(frame);
        frame = 0;
      } else if (!document.hidden) scheduleDraw();
    });
    window.addEventListener('beforeunload', () => cancelAnimationFrame(frame), { once: true });
  }

  // --- RENDERING PIPELINE ---
  function renderAll() {
    renderKanban();
    renderMetrics();
    renderReadiness();
    renderNotes();
    renderActivity();
    updateDeadlineDisplay();
  }

  // --- METRICS CALCULATION ---
  function renderMetrics() {
    const total = tasks.length;
    const doneCount = tasks.filter(t => t.status === 'done').length;
    const reviewCount = tasks.filter(t => t.status === 'review').length;
    const inProgressCount = tasks.filter(t => t.status === 'in-progress').length;
    const todoCount = tasks.filter(t => t.status === 'todo').length;

    const percent = total > 0 ? Math.round((doneCount / total) * 100) : 0;

    // KPI Elements
    dom.kpiPercent.textContent = `${percent}%`;
    dom.kpiCompletedFraction.textContent = `${doneCount}/${total} Tasks`;
    dom.kpiProgressBar.style.width = `${percent}%`;

    dom.kpiInProgress.textContent = inProgressCount;
    dom.kpiReview.textContent = reviewCount;
    dom.kpiTodo.textContent = todoCount;
    dom.filterCountAll.textContent = total;

    // Sidebar Widget
    dom.sidebarProgressValue.textContent = `${percent}%`;
    dom.sidebarProgressBar.style.width = `${percent}%`;
    dom.sidebarProgressSubtitle.textContent = `${doneCount} of ${total} tasks done`;
    dom.navTaskCount.textContent = total;
    if (dom.corePercentText) dom.corePercentText.textContent = `${percent}%`;
    const activeCount = inProgressCount + reviewCount;
    const readinessPercent = checklist.length ? Math.round(checklist.filter(item => item.completed).length / checklist.length * 100) : 0;
    if (dom.activeTasksContext) dom.activeTasksContext.textContent = activeCount;
    if (dom.readinessContext) dom.readinessContext.textContent = `${readinessPercent}%`;
    if (dom.openTasksContext) dom.openTasksContext.textContent = total - doneCount;
    if (dom.topHealthText) dom.topHealthText.textContent = activeCount ? `Project status: ${activeCount} active` : 'Project status: no active tasks';
    if (dom.heroHealthText) dom.heroHealthText.textContent = `READINESS: ${readinessPercent}%`;
    updateProjectCoreLabels();
    if (dom.shipCompletion) dom.shipCompletion.textContent = `${percent}%`;
    if (dom.shipActive) dom.shipActive.textContent = activeCount;
    if (dom.shipRemaining) dom.shipRemaining.textContent = total - doneCount;
    updateShipStatus();
  }

  function updateProjectCoreLabels() {
    const completed = tasks.length ? tasks.filter(task => task.status === 'done').length / tasks.length : 0;
    const readiness = checklist.length ? checklist.filter(item => item.completed).length / checklist.length : 0;
    const active = tasks.some(task => task.status === 'in-progress' || task.status === 'review');
    const hoursLeft = deadline ? (deadline.getTime() - Date.now()) / 3600000 : Infinity;
    if (dom.corePercentText) dom.corePercentText.textContent = `${Math.round(completed * 100)}%`;
    if (dom.coreStateText) {
      dom.coreStateText.textContent = hoursLeft <= 0 ? 'DEADLINE PASSED' : hoursLeft < 18 ? 'DEADLINE NEAR' : readiness >= 0.8 ? 'DEMO READY' : active ? 'SYSTEM ACTIVE' : 'STANDING BY';
    }
  }

  function updateShipStatus() {
    if (!dom.shipStatus) return;
    if (deadline && deadline.getTime() < Date.now()) {
      dom.shipStatus.textContent = 'DEADLINE PASSED';
      return;
    }
    const readyPercent = checklist.length ? checklist.filter(item => item.completed).length / checklist.length : 0;
    dom.shipStatus.textContent = tasks.length > 0 && tasks.every(task => task.status === 'done') && readyPercent === 1 ? 'READY TO SHIP' : 'IN PROGRESS';
  }

  // --- KANBAN RENDERING (TO DO, IN PROGRESS, REVIEW, DONE) ---
  function updateBoardFilterUI() {
    dom.filterPills.forEach(p => {
      const isActive = p.getAttribute('data-filter') === activeFilter;
      p.classList.toggle('active', isActive);
      p.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });
  }

  function renderKanban() {
    updateBoardFilterUI();
    const query = searchQuery.trim().toLowerCase();

    const filtered = tasks.filter(task => {
      const matchesSearch = !query ||
        task.title.toLowerCase().includes(query) ||
        (task.description && task.description.toLowerCase().includes(query)) ||
        (task.tag && task.tag.toLowerCase().includes(query)) ||
        (task.assignee && task.assignee.toLowerCase().includes(query));

      if (!matchesSearch) return false;

      if (activeFilter === 'urgent') return task.priority === 'urgent' || task.priority === 'high';
      if (activeFilter === 'frontend') return (task.tag || '').toLowerCase() === 'frontend';
      if (activeFilter === 'backend') return (task.tag || '').toLowerCase().includes('backend') || (task.tag || '').toLowerCase().includes('ai');
      if (activeFilter === 'pitch') return (task.tag || '').toLowerCase().includes('pitch');

      return true;
    });

    const todoTasks = filtered.filter(t => t.status === 'todo');
    const inProgressTasks = filtered.filter(t => t.status === 'in-progress');
    const reviewTasks = filtered.filter(t => t.status === 'review');
    const doneTasks = filtered.filter(t => t.status === 'done');

    // Column counters
    dom.countTodo.textContent = tasks.filter(t => t.status === 'todo').length;
    dom.countInProgress.textContent = tasks.filter(t => t.status === 'in-progress').length;
    dom.countReview.textContent = tasks.filter(t => t.status === 'review').length;
    dom.countDone.textContent = tasks.filter(t => t.status === 'done').length;

    // Render cards
    renderColumnCards(dom.cardsTodo, todoTasks, 'todo');
    renderColumnCards(dom.cardsInProgress, inProgressTasks, 'in-progress');
    renderColumnCards(dom.cardsReview, reviewTasks, 'review');
    renderColumnCards(dom.cardsDone, doneTasks, 'done');
  }

  function renderColumnCards(container, columnTasks, status) {
    container.innerHTML = '';

    if (columnTasks.length === 0) {
      const emptyDiv = document.createElement('div');
      emptyDiv.className = 'empty-col-notice';
      emptyDiv.textContent = searchQuery ? 'No matching tasks' : activeFilter !== 'all' ? `No ${activeFilter} tasks in this stage` : 'No tasks in this stage';
      container.appendChild(emptyDiv);
      return;
    }

    columnTasks.forEach((task, index) => {
      const card = createTaskCardElement(task);
      card.style.animationDelay = `${index * 0.03}s`;
      container.appendChild(card);
    });
  }

  function createTaskCardElement(task) {
    const card = document.createElement('div');
    card.className = 'task-card';
    card.setAttribute('draggable', 'true');
    card.setAttribute('data-id', task.id);
    card.setAttribute('data-status', task.status);

    const initials = getInitials(task.assignee || 'Unassigned');
    const priorityClass = `priority-${task.priority || 'medium'}`;

    card.innerHTML = `
      <div class="task-card-header">
        <div class="task-pill-strip">
          <span class="task-domain-pill">${escapeHtml(task.tag || 'General')}</span>
          <span class="priority-badge ${priorityClass}">${escapeHtml(task.priority || 'medium')}</span>
        </div>
      </div>
      <h4 class="task-card-title">${escapeHtml(task.title)}</h4>
      ${task.description ? `<p class="task-card-desc">${escapeHtml(task.description)}</p>` : ''}
      ${reminders.some(item => item.taskId === task.id && item.status !== 'dismissed') ? `<div class="task-reminder-link">${reminders.filter(item => item.taskId === task.id && item.status !== 'dismissed').length} linked reminder${reminders.filter(item => item.taskId === task.id && item.status !== 'dismissed').length === 1 ? '' : 's'}</div>` : ''}
      <div class="task-card-bottom">
        <div class="task-assignee-box" title="${escapeHtml(task.assignee || 'Unassigned')}">
          <div class="task-avatar">${initials}</div>
          <span class="task-assignee-name">${escapeHtml(task.assignee || 'Unassigned')}</span>
        </div>
        <div class="task-card-actions">
          <button class="card-mini-btn task-reminder-btn" data-id="${escapeHtml(task.id)}" title="Add reminder for task" aria-label="Add reminder for ${escapeHtml(task.title)}">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><circle cx="12" cy="12" r="9"></circle><path d="M12 7v5l3 2"></path></svg>
          </button>
          ${task.status !== 'todo' ? `
            <button class="card-step-btn step-prev-btn" data-id="${task.id}" title="Step backward" aria-label="Step backward">◀</button>
          ` : ''}
          ${task.status !== 'done' ? `
            <button class="card-step-btn step-next-btn" data-id="${task.id}" title="Step forward" aria-label="Step forward">▶</button>
          ` : ''}
          <button class="card-mini-btn edit-task-btn" data-id="${task.id}" title="Edit task" aria-label="Edit task">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 20h9"></path>
              <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
            </svg>
          </button>
          <button class="card-mini-btn danger delete-task-btn" data-id="${task.id}" title="Delete task" aria-label="Delete task">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
      </div>
    `;

    // Drag event attachments
    card.addEventListener('dragstart', handleDragStart);
    card.addEventListener('dragend', handleDragEnd);

    // Button event listeners
    const editBtn = card.querySelector('.edit-task-btn');
    if (editBtn) {
      editBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        openEditTaskModal(task.id);
      });
    }

    card.querySelector('.task-reminder-btn').addEventListener('click', (e) => {
      e.stopPropagation();
      openCreateReminder(task.id);
    });

    const deleteBtn = card.querySelector('.delete-task-btn');
    if (deleteBtn) {
      deleteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        confirmDeleteTask(task.id);
      });
    }

    const prevBtn = card.querySelector('.step-prev-btn');
    if (prevBtn) {
      prevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        stepTaskStage(task.id, -1);
      });
    }

    const nextBtn = card.querySelector('.step-next-btn');
    if (nextBtn) {
      nextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        stepTaskStage(task.id, 1);
      });
    }

    return card;
  }

  // --- KANBAN DRAG AND DROP ---
  let draggedTaskId = null;

  function handleDragStart(e) {
    draggedTaskId = this.getAttribute('data-id');
    this.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', draggedTaskId);
  }

  function handleDragEnd() {
    this.classList.remove('dragging');
    document.querySelectorAll('.kanban-col-wrapper').forEach(col => col.classList.remove('drag-over'));
  }

  function setupKanbanDragAndDrop() {
    const columns = document.querySelectorAll('.kanban-col-wrapper');

    columns.forEach(column => {
      column.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        column.classList.add('drag-over');
      });

      column.addEventListener('dragleave', (e) => {
        if (!column.contains(e.relatedTarget)) {
          column.classList.remove('drag-over');
        }
      });

      column.addEventListener('drop', (e) => {
        e.preventDefault();
        column.classList.remove('drag-over');
        const taskId = e.dataTransfer.getData('text/plain') || draggedTaskId;
        const targetStatus = column.getAttribute('data-status');

        if (taskId && targetStatus) {
          moveTask(taskId, targetStatus);
        }
      });
    });
  }

  // --- TASK STATE MUTATIONS ---
  function moveTask(taskId, newStatus) {
    const task = tasks.find(t => t.id === taskId);
    if (!task || task.status === newStatus) return;

    const oldStatus = task.status;
    task.status = newStatus;
    saveTasks();
    renderKanban();
    renderMetrics();

    logActivity(`Moved task <strong>${escapeHtml(task.title.substring(0, 32))}</strong> to <strong>${formatStatusName(newStatus)}</strong>`, newStatus === 'done' ? 'emerald' : 'cyan', newStatus === 'done' ? 'completed' : 'moved');
    showToast(`Task moved to ${formatStatusName(newStatus)}`, 'toast-info');
  }

  function stepTaskStage(taskId, stepDirection) {
    const stages = ['todo', 'in-progress', 'review', 'done'];
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    const currentIndex = stages.indexOf(task.status);
    const nextIndex = currentIndex + stepDirection;

    if (nextIndex >= 0 && nextIndex < stages.length) {
      task.status = stages[nextIndex];
      saveTasks();
      renderKanban();
      renderMetrics();

      logActivity(`Stepped task <strong>${escapeHtml(task.title.substring(0, 32))}</strong> to <strong>${formatStatusName(task.status)}</strong>`, task.status === 'done' ? 'emerald' : 'violet', task.status === 'done' ? 'completed' : 'moved');
      showToast(`Task moved to ${formatStatusName(task.status)}`, 'toast-info');
    }
  }

  function confirmDeleteTask(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    askConfirmation({
      title: 'Delete Task?',
      desc: `Are you sure you want to permanently remove "${task.title}"?`,
      confirmLabel: 'Delete Task',
      onConfirm: () => {
        tasks = tasks.filter(t => t.id !== taskId);
        reminders.forEach(reminder => { if (reminder.taskId === taskId) reminder.taskId = ''; });
        saveTasks();
        saveReminders();
        renderReminderCenter();
        renderKanban();
        renderMetrics();

        logActivity(`Deleted task <strong>${escapeHtml(task.title.substring(0, 32))}</strong>`, 'rose', 'deleted');
        showToast('Task removed from sprint board', 'toast-danger');
      }
    });
  }

  function openCreateTaskModal(defaultStatus = 'todo') {
    dom.taskForm.reset();
    dom.taskFormId.value = '';
    dom.taskModalTitle.textContent = 'Create New Task';
    dom.taskPrioritySelect.value = 'high';
    dom.taskTagSelect.value = 'AI / ML';
    dom.taskAssigneeInput.value = '';

    setModalStage(defaultStatus);
    openModal(dom.taskModal);
    setTimeout(() => dom.taskTitleInput.focus(), 60);
  }

  function openEditTaskModal(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    dom.taskFormId.value = task.id;
    dom.taskModalTitle.textContent = 'Edit Task';
    dom.taskTitleInput.value = task.title;
    dom.taskDescInput.value = task.description || '';
    dom.taskPrioritySelect.value = task.priority;
    dom.taskTagSelect.value = task.tag || 'AI / ML';
    dom.taskAssigneeInput.value = task.assignee || '';

    setModalStage(task.status);
    openModal(dom.taskModal);
    setTimeout(() => dom.taskTitleInput.focus(), 60);
  }

  function handleTaskFormSubmit(e) {
    e.preventDefault();

    const title = dom.taskTitleInput.value.trim();
    if (!title) {
      showToast('Please enter a task title', 'toast-warning');
      return;
    }

    const id = dom.taskFormId.value;
    const description = dom.taskDescInput.value.trim();
    const status = dom.taskStatusSelect.value;
    const priority = dom.taskPrioritySelect.value;
    const tag = dom.taskTagSelect.value;
    const assignee = dom.taskAssigneeInput.value.trim() || 'Unassigned';

    if (id) {
      const task = tasks.find(t => t.id === id);
      if (task) {
        task.title = title;
        task.description = description;
        task.status = status;
        task.priority = priority;
        task.tag = tag;
        task.assignee = assignee;

        logActivity(`Updated task <strong>${escapeHtml(task.title.substring(0, 32))}</strong>`, status === 'done' ? 'emerald' : 'cyan', status === 'done' ? 'completed' : 'edited');
        showToast('Task updated successfully', 'toast-success');
      }
    } else {
      const newTask = {
        id: 'task-' + Date.now(),
        title,
        description,
        status,
        priority,
        tag,
        assignee
      };
      tasks.push(newTask);
      logActivity(`Created new task <strong>${escapeHtml(newTask.title.substring(0, 32))}</strong>`, status === 'done' ? 'emerald' : 'emerald', status === 'done' ? 'completed' : 'created');
      showToast('Task added to sprint pipeline', 'toast-success');
    }

    saveTasks();
    renderReminderCenter();
    closeModal(dom.taskModal);
    renderKanban();
    renderMetrics();
  }

  // --- MODAL STAGE SWITCHER ---
  function initModalStageSwitcher() {
    if (!dom.modalStageSwitcher) return;
    const btns = dom.modalStageSwitcher.querySelectorAll('.stage-select-btn');

    btns.forEach(btn => {
      btn.addEventListener('click', () => {
        const stage = btn.getAttribute('data-stage');
        setModalStage(stage);
      });
    });
  }

  function setModalStage(stage) {
    if (!dom.modalStageSwitcher) return;
    const btns = dom.modalStageSwitcher.querySelectorAll('.stage-select-btn');

    btns.forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-stage') === stage);
    });

    if (dom.taskStatusSelect) {
      dom.taskStatusSelect.value = stage;
    }
  }

  // --- DEMO READINESS CHECKLIST ---
  function renderReadiness() {
    dom.checklistContainer.innerHTML = '';
    const completedCount = checklist.filter(c => c.completed).length;
    const totalCount = checklist.length;
    const percent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

    dom.readinessScoreText.textContent = `${percent}% Ready`;
    dom.readinessFractionText.textContent = `${completedCount} of ${totalCount} items verified`;
    dom.navReadinessBadge.textContent = `${percent}%`;
    if (dom.readinessContext) dom.readinessContext.textContent = `${percent}%`;
    if (dom.heroHealthText) dom.heroHealthText.textContent = `READINESS: ${percent}%`;
    if (dom.shipReadiness) dom.shipReadiness.textContent = `${percent}%`;
    updateProjectCoreLabels();
    updateShipStatus();

    checklist.forEach(item => {
      const card = document.createElement('div');
      card.className = `checklist-card ${item.completed ? 'done' : ''}`;
      card.innerHTML = `
        <div class="check-box-visual">
          ${item.completed ? `
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          ` : ''}
        </div>
        <div class="check-text-group">
          <span class="check-primary-label">${escapeHtml(item.label)}</span>
          <span class="check-secondary-sub">${escapeHtml(item.sub)}</span>
        </div>
      `;

      card.addEventListener('click', () => {
        item.completed = !item.completed;
        saveChecklist();
        renderReadiness();
        logActivity(`${item.completed ? 'Verified' : 'Unchecked'} deliverable: <strong>${escapeHtml(item.label)}</strong>`, item.completed ? 'emerald' : 'amber', item.completed ? 'completed' : 'edited');
        showToast(`Updated deliverable: ${item.label}`, 'toast-info');
      });

      dom.checklistContainer.appendChild(card);
    });
  }

  // --- QUICK NOTES WORKSPACE ---
  function renderNotes() {
    const query = searchQuery.trim().toLowerCase();
    const filteredNotes = notes.filter(note => {
      if (!query) return true;
      return note.title.toLowerCase().includes(query) || note.content.toLowerCase().includes(query);
    });

    // Pinned notes sort to the top
    filteredNotes.sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0));

    dom.notesGrid.innerHTML = '';

    if (filteredNotes.length === 0) {
      const emptyCard = document.createElement('div');
      emptyCard.className = 'empty-col-notice';
      emptyCard.style.gridColumn = '1 / -1';
      emptyCard.textContent = searchQuery ? 'No notes matching search filter' : 'No scratchpad notes yet. Click "+ Create Note" to add ideas!';
      dom.notesGrid.appendChild(emptyCard);
      return;
    }

    filteredNotes.forEach((note, index) => {
      const card = document.createElement('div');
      card.className = `note-bubble-card color-${note.color || 'cyan'} ${note.isPinned ? 'pinned' : ''}`;
      card.style.animationDelay = `${index * 0.04}s`;
      card.innerHTML = `
        <div class="note-top-header">
          <h4 class="note-headline">${escapeHtml(note.title)}</h4>
          <div class="note-ctrl-strip">
            <button class="note-action-icon pin-note-btn ${note.isPinned ? 'active' : ''}" data-id="${note.id}" title="${note.isPinned ? 'Unpin note' : 'Pin to top'}">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="${note.isPinned ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
                <line x1="12" y1="17" x2="12" y2="22"></line>
                <path d="M5 17h14v-1.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V6h1a1 1 0 0 0 0-2H8a1 1 0 0 0 0 2h1v4.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24Z"></path>
              </svg>
            </button>
            <button class="note-action-icon edit-note-btn" data-id="${note.id}" title="Edit note">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 20h9"></path>
                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
              </svg>
            </button>
            <button class="note-action-icon delete-note-btn" data-id="${note.id}" title="Delete note">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>
        <p class="note-body-text">${escapeHtml(note.content)}</p>
        <div class="note-bottom-meta">
          <span>${escapeHtml(note.date || 'Active')}</span>
          <span style="text-transform:uppercase;font-weight:700;letter-spacing:0.06em;">${escapeHtml(note.color || 'Note')}</span>
        </div>
      `;

      card.querySelector('.pin-note-btn').addEventListener('click', () => togglePinNote(note.id));
      card.querySelector('.edit-note-btn').addEventListener('click', () => openEditNoteModal(note.id));
      card.querySelector('.delete-note-btn').addEventListener('click', () => confirmDeleteNote(note.id));

      dom.notesGrid.appendChild(card);
    });

    dom.navNotesCount.textContent = notes.length;
  }

  function openCreateNoteModal() {
    dom.noteForm.reset();
    dom.noteFormId.value = '';
    dom.noteModalTitle.textContent = 'New Quick Note';
    dom.notePinnedInput.checked = false;
    openModal(dom.noteModal);
    setTimeout(() => dom.noteTitleInput.focus(), 60);
  }

  function openEditNoteModal(noteId) {
    const note = notes.find(n => n.id === noteId);
    if (!note) return;

    dom.noteFormId.value = note.id;
    dom.noteModalTitle.textContent = 'Edit Note';
    dom.noteTitleInput.value = note.title;
    dom.noteBodyInput.value = note.content;
    dom.notePinnedInput.checked = !!note.isPinned;

    const radio = document.querySelector(`input[name="noteColor"][value="${note.color || 'cyan'}"]`);
    if (radio) radio.checked = true;

    openModal(dom.noteModal);
    setTimeout(() => dom.noteTitleInput.focus(), 60);
  }

  function handleNoteFormSubmit(e) {
    e.preventDefault();
    const title = dom.noteTitleInput.value.trim();
    const content = dom.noteBodyInput.value.trim();
    if (!title || !content) return;

    const id = dom.noteFormId.value;
    const selectedColorInput = document.querySelector('input[name="noteColor"]:checked');
    const color = selectedColorInput ? selectedColorInput.value : 'cyan';
    const isPinned = dom.notePinnedInput.checked;

    const now = new Date();
    const dateStr = now.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) +
      ', ' + now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    if (id) {
      const note = notes.find(n => n.id === id);
      if (note) {
        note.title = title;
        note.content = content;
        note.color = color;
        note.isPinned = isPinned;
        logActivity(`Updated note: <strong>${escapeHtml(note.title.substring(0, 32))}</strong>`, 'violet', 'edited');
        showToast('Note updated', 'toast-success');
      }
    } else {
      const newNote = {
        id: 'note-' + Date.now(),
        title,
        content,
        color,
        isPinned,
        date: dateStr
      };
      notes.unshift(newNote);
      logActivity(`Created note: <strong>${escapeHtml(newNote.title.substring(0, 32))}</strong>`, 'magenta', 'created');
      showToast('Quick note created', 'toast-success');
    }

    saveNotes();
    closeModal(dom.noteModal);
    renderNotes();
  }

  function togglePinNote(noteId) {
    const note = notes.find(n => n.id === noteId);
    if (!note) return;

    note.isPinned = !note.isPinned;
    saveNotes();
    renderNotes();
    showToast(note.isPinned ? 'Note pinned to top' : 'Note unpinned', 'toast-info');
  }

  function confirmDeleteNote(noteId) {
    const note = notes.find(n => n.id === noteId);
    if (!note) return;

    askConfirmation({
      title: 'Delete Note?',
      desc: `Are you sure you want to delete note "${note.title}"?`,
      confirmLabel: 'Delete Note',
      onConfirm: () => {
        notes = notes.filter(n => n.id !== noteId);
        saveNotes();
        renderNotes();
        logActivity(`Deleted note: <strong>${escapeHtml(note.title.substring(0, 32))}</strong>`, 'rose', 'deleted');
        showToast('Note removed from scratchpad', 'toast-danger');
      }
    });
  }

  function formatRelativeTime(item) {
    if (item && item.timestamp) {
      const diffSec = Math.max(0, Math.floor((Date.now() - item.timestamp) / 1000));
      if (diffSec < 60) return 'Just now';
      const diffMin = Math.floor(diffSec / 60);
      if (diffMin < 60) return `${diffMin}m ago`;
      const diffHr = Math.floor(diffMin / 60);
      if (diffHr < 24) return `${diffHr}h ago`;
      const diffDays = Math.floor(diffHr / 24);
      return `${diffDays}d ago`;
    }
    return item && item.time ? item.time : 'recent';
  }

  function updateActivityFilterUI() {
    const pills = document.querySelectorAll('[data-activity-filter]');
    pills.forEach(pill => {
      const pillFilter = pill.getAttribute('data-activity-filter');
      const isActive = pillFilter === activityFilter;
      pill.classList.toggle('active', isActive);
      pill.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });
  }

  function setActivityFilter(filterName) {
    activityFilter = filterName;
    saveActivityFilter();
    renderActivity();
    showToast(`Activity filter: ${filterName.toUpperCase()}`, 'toast-info');
  }

  function clearActivityFeed() {
    activity = [];
    activityFilter = 'all';
    saveActivity();
    saveActivityFilter();
    renderActivity();
    showToast('Activity stream cleared', 'toast-info');
  }

  // --- ACTIVITY FEED RENDERING ---
  function renderActivity() {
    dom.activityStreamContainer.innerHTML = '';
    updateActivityFilterUI();

    if (activity.length === 0) {
      const emptyRow = document.createElement('div');
      emptyRow.className = 'empty-col-notice';
      emptyRow.textContent = 'No recent activity recorded';
      dom.activityStreamContainer.appendChild(emptyRow);
      return;
    }

    const filtered = activity.filter(item => {
      if (activityFilter === 'all') return true;
      const act = item.action || inferActivityAction(item.text);
      return act === activityFilter;
    });

    if (filtered.length === 0) {
      const emptyRow = document.createElement('div');
      emptyRow.className = 'empty-col-notice';
      emptyRow.textContent = `No "${activityFilter}" activity recorded yet`;
      dom.activityStreamContainer.appendChild(emptyRow);
      return;
    }

    filtered.forEach(item => {
      const row = document.createElement('div');
      row.className = 'activity-row';
      row.innerHTML = `
        <div class="activity-icon-badge badge-${item.type || 'cyan'}">⚡</div>
        <div class="activity-content">${item.text}</div>
        <div class="activity-timestamp">${escapeHtml(formatRelativeTime(item))}</div>
      `;
      dom.activityStreamContainer.appendChild(row);
    });
  }

  function exportActivityFeed() {
    if (!activity || activity.length === 0) {
      showToast('Activity feed is empty', 'toast-warning');
      return;
    }

    try {
      const itemsToExport = activityFilter === 'all'
        ? activity
        : activity.filter(item => (item.action || inferActivityAction(item.text)) === activityFilter);

      if (itemsToExport.length === 0) {
        showToast(`No "${activityFilter}" activities to export`, 'toast-warning');
        return;
      }

      const payload = JSON.stringify(itemsToExport, null, 2);
      const blob = new Blob([payload], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const filterSuffix = activityFilter === 'all' ? '' : `-${activityFilter}`;
      a.download = `aegis-activity-feed${filterSuffix}-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 200);
      showToast(activityFilter === 'all' ? 'Activity feed exported as JSON' : `Filtered (${activityFilter.toUpperCase()}) activity exported as JSON`, 'toast-success');
    } catch (err) {
      console.error('Export error:', err);
      showToast('Failed to export activity feed', 'toast-danger');
    }
  }

  function exportTasksJSON() {
    if (!tasks || tasks.length === 0) {
      showToast('No sprint tasks to export', 'toast-warning');
      return;
    }

    try {
      const query = searchQuery.trim().toLowerCase();
      const itemsToExport = tasks.filter(task => {
        const matchesSearch = !query ||
          task.title.toLowerCase().includes(query) ||
          (task.description && task.description.toLowerCase().includes(query)) ||
          (task.tag && task.tag.toLowerCase().includes(query)) ||
          (task.assignee && task.assignee.toLowerCase().includes(query));

        if (!matchesSearch) return false;

        if (activeFilter === 'urgent') return task.priority === 'urgent' || task.priority === 'high';
        if (activeFilter === 'frontend') return (task.tag || '').toLowerCase() === 'frontend';
        if (activeFilter === 'backend') return (task.tag || '').toLowerCase().includes('backend') || (task.tag || '').toLowerCase().includes('ai');
        if (activeFilter === 'pitch') return (task.tag || '').toLowerCase().includes('pitch');

        return true;
      });

      if (itemsToExport.length === 0) {
        showToast('No matching tasks to export', 'toast-warning');
        return;
      }

      const payload = JSON.stringify(itemsToExport, null, 2);
      const blob = new Blob([payload], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const filterSuffix = activeFilter === 'all' ? '' : `-${activeFilter}`;
      a.download = `aegis-sprint-tasks${filterSuffix}-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 200);
      showToast(activeFilter === 'all' ? 'All sprint tasks exported as JSON' : `Filtered (${activeFilter.toUpperCase()}) tasks exported as JSON`, 'toast-success');
    } catch (err) {
      console.error('Export tasks error:', err);
      showToast('Failed to export sprint tasks', 'toast-danger');
    }
  }

  // --- COUNTDOWN TIMER (OCTOBER 10, 2026, 23:59:59 GMT+5:30) ---
  function startCountdownTimer() {
    updateCountdownTick();
    if (countdownInterval) clearInterval(countdownInterval);
    countdownInterval = setInterval(updateCountdownTick, 1000);
  }

  function updateCountdownTick() {
    updateProjectCoreLabels();
    const now = new Date().getTime();
    const target = deadline.getTime();
    const diff = target - now;

    if (diff <= 0) {
      dom.timerDays.textContent = '00';
      dom.timerHours.textContent = '00';
      dom.timerMinutes.textContent = '00';
      dom.timerSeconds.textContent = '00';
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    const pad = (n) => String(n).padStart(2, '0');

    dom.timerDays.textContent = pad(days);
    dom.timerHours.textContent = pad(hours);
    dom.timerMinutes.textContent = pad(minutes);
    dom.timerSeconds.textContent = pad(seconds);
  }

  function updateDeadlineDisplay() {
    const options = {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short'
    };
    const formatted = deadline.toLocaleDateString(undefined, options);
    dom.displayDeadlineString.textContent = `Target: ${formatted}`;
    const shortDate = deadline.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
    dom.displayDeadlineShort.textContent = shortDate;
    if (dom.timelineDeadlineText) {
      dom.timelineDeadlineText.textContent = deadline.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) + ', ' + deadline.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
    }
    if (dom.shipDeadline) dom.shipDeadline.textContent = deadline.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
    updateProjectCoreLabels();
    updateShipStatus();
  }

  function openEditDeadlineModal() {
    const localIso = new Date(deadline.getTime() - (deadline.getTimezoneOffset() * 60000)).toISOString().slice(0, 16);
    dom.deadlineDatetimeInput.value = localIso;
    openModal(dom.deadlineModal);
  }

  function handleDeadlineFormSubmit(e) {
    e.preventDefault();
    const val = dom.deadlineDatetimeInput.value;
    if (!val) return;

    const newDate = new Date(val);
    if (isNaN(newDate.getTime())) {
      showToast('Invalid date provided', 'toast-warning');
      return;
    }

    deadline = newDate;
    saveDeadline();
    closeModal(dom.deadlineModal);
    updateDeadlineDisplay();
    updateCountdownTick();

    logActivity(`Deadline synchronized to <strong>${newDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</strong>`, 'amber', 'edited');
    showToast('Countdown deadline updated!', 'toast-success');
  }

  function applyDeadlinePreset(hoursToAdd) {
    const newTarget = new Date(Date.now() + hoursToAdd * 60 * 60 * 1000);
    const localIso = new Date(newTarget.getTime() - (newTarget.getTimezoneOffset() * 60000)).toISOString().slice(0, 16);
    dom.deadlineDatetimeInput.value = localIso;
  }

  // --- RAYCAST-STYLE COMMAND PALETTE (CTRL+K or /) ---
  const PALETTE_ACTIONS = [
    { id: 'jump-overview', group: 'Navigation', title: 'Go to Overview & Hero', icon: '⚡', run: () => scrollToSection('overview') },
    { id: 'jump-board', group: 'Navigation', title: 'Go to Sprint Board (Kanban)', icon: '📋', run: () => scrollToSection('board-section') },
    { id: 'jump-timeline', group: 'Navigation', title: 'Go to Hackathon Timeline', icon: '⏱️', run: () => scrollToSection('timeline-section') },
    { id: 'jump-readiness', group: 'Navigation', title: 'Go to Demo Readiness', icon: '✓', run: () => scrollToSection('readiness-section') },
    { id: 'jump-notes', group: 'Navigation', title: 'Go to Scratchpad Notes', icon: '📝', run: () => scrollToSection('notes-section') },
    { id: 'jump-activity', group: 'Navigation', title: 'Go to Audit Stream Feed', icon: '📊', run: () => scrollToSection('activity-section') },

    { id: 'act-new-task', group: 'Actions', title: 'Create New Task...', icon: '+', run: () => openCreateTaskModal('todo') },
    { id: 'act-new-note', group: 'Actions', title: 'Create Quick Note...', icon: '✍️', run: openCreateNoteModal },
    { id: 'act-reminder-center', group: 'Actions', title: 'Open Reminder Center...', icon: '◷', run: openReminderCenter },
    { id: 'act-new-reminder', group: 'Actions', title: 'Create Reminder...', icon: '⏰', run: () => openCreateReminder() },
    { id: 'act-ai-reminder', group: 'Actions', title: 'Ask Aegis to create a reminder...', icon: '✧', run: openAiReminder },
    { id: 'act-deadline', group: 'Actions', title: 'Edit Countdown Deadline...', icon: '📅', run: openEditDeadlineModal },
    { id: 'act-filter-urgent', group: 'Filters', title: 'Filter Urgent / High Priority Tasks', icon: '🔥', run: () => setFilter('urgent') },
    { id: 'act-filter-all', group: 'Filters', title: 'Show All Tasks', icon: '👁️', run: () => setFilter('all') },
    { id: 'act-export-tasks', group: 'Actions', title: 'Export Sprint Tasks as JSON', icon: '📋', run: exportTasksJSON },
    { id: 'act-export-activity', group: 'Actions', title: 'Export Activity Stream as JSON', icon: '📥', run: exportActivityFeed },
    { id: 'act-clear-activity', group: 'Actions', title: 'Clear Activity Stream Feed', icon: '🧹', run: clearActivityFeed },
    { id: 'act-reset-demo', group: 'Danger Zone', title: 'Reset Demo State to Default', icon: '↺', run: resetToDefaults }
  ];

  let selectedPaletteIndex = 0;
  let activeFilteredActions = [];

  function initCommandPalette() {
    renderPaletteItems('');

    dom.paletteSearchInput.addEventListener('input', (e) => {
      renderPaletteItems(e.target.value);
    });

    dom.paletteSearchInput.addEventListener('keydown', handlePaletteKeydown);
  }

  function renderPaletteItems(query) {
    const q = query.trim().toLowerCase();
    activeFilteredActions = PALETTE_ACTIONS.filter(act => {
      if (!q) return true;
      return act.title.toLowerCase().includes(q) || act.group.toLowerCase().includes(q);
    });

    selectedPaletteIndex = 0;
    dom.paletteResultsList.innerHTML = '';

    if (activeFilteredActions.length === 0) {
      const emptyDiv = document.createElement('div');
      emptyDiv.className = 'empty-col-notice';
      emptyDiv.textContent = 'No commands match your search';
      dom.paletteResultsList.appendChild(emptyDiv);
      return;
    }

    let lastGroup = null;
    activeFilteredActions.forEach((act, idx) => {
      if (act.group !== lastGroup) {
        lastGroup = act.group;
        const groupEl = document.createElement('div');
        groupEl.className = 'palette-group-heading';
        groupEl.textContent = act.group;
        dom.paletteResultsList.appendChild(groupEl);
      }

      const item = document.createElement('div');
      item.className = `palette-item ${idx === selectedPaletteIndex ? 'selected' : ''}`;
      item.setAttribute('data-index', idx);
      item.innerHTML = `
        <span style="font-size:1.05rem;">${act.icon}</span>
        <span>${escapeHtml(act.title)}</span>
        <span class="palette-item-tag">${escapeHtml(act.group)}</span>
      `;

      item.addEventListener('click', () => {
        executePaletteAction(idx);
      });

      dom.paletteResultsList.appendChild(item);
    });
  }

  function handlePaletteKeydown(e) {
    if (activeFilteredActions.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      selectedPaletteIndex = (selectedPaletteIndex + 1) % activeFilteredActions.length;
      updatePaletteSelectionUI();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      selectedPaletteIndex = (selectedPaletteIndex - 1 + activeFilteredActions.length) % activeFilteredActions.length;
      updatePaletteSelectionUI();
    } else if (e.key === 'Enter') {
      e.preventDefault();
      executePaletteAction(selectedPaletteIndex);
    }
  }

  function updatePaletteSelectionUI() {
    const items = dom.paletteResultsList.querySelectorAll('.palette-item');
    items.forEach((item, idx) => {
      item.classList.toggle('selected', idx === selectedPaletteIndex);
      if (idx === selectedPaletteIndex) {
        item.scrollIntoView({ block: 'nearest' });
      }
    });
  }

  function executePaletteAction(index) {
    const action = activeFilteredActions[index];
    if (action) {
      closeCommandPalette();
      action.run();
    }
  }

  function openCommandPalette() {
    dom.commandPalette.classList.add('active');
    dom.commandPalette.setAttribute('aria-hidden', 'false');
    dom.paletteSearchInput.value = '';
    renderPaletteItems('');
    document.body.style.overflow = 'hidden';
    setTimeout(() => dom.paletteSearchInput.focus(), 50);
  }

  function closeCommandPalette() {
    dom.commandPalette.classList.remove('active');
    dom.commandPalette.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function scrollToSection(sectionId) {
    const target = document.getElementById(sectionId);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  }

  function setFilter(filterName) {
    activeFilter = filterName;
    saveBoardFilter();
    updateBoardFilterUI();
    renderKanban();
    showToast(`Task filter: ${filterName.toUpperCase()}`, 'toast-info');
  }

  // --- CONFIRMATION DIALOG (FOR DESTRUCTIVE ACTIONS) ---
  function askConfirmation({ title, desc, confirmLabel = 'Confirm', onConfirm }) {
    dom.confirmModalTitle.textContent = title;
    dom.confirmModalDesc.textContent = desc;
    dom.confirmProceedBtn.textContent = confirmLabel;
    pendingConfirmAction = onConfirm;

    openModal(dom.confirmModal);
  }

  // --- MODAL UTILITIES ---
  function openModal(modal) {
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeModal(modal) {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  // --- TOAST NOTIFICATIONS ---
  function showToast(message, type = 'toast-info') {
    const toast = document.createElement('div');
    toast.className = `toast-pill ${type}`;

    let icon = '⚡';
    if (type === 'toast-success') icon = '✓';
    if (type === 'toast-warning') icon = '⚠️';
    if (type === 'toast-danger') icon = '🗑️';

    toast.innerHTML = `<span>${icon}</span><span>${escapeHtml(message)}</span>`;
    dom.toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.animation = 'toastExit 0.25s forwards';
      setTimeout(() => toast.remove(), 250);
    }, 3200);
  }

  // --- PERSISTENT REMINDERS ---
  let reminderInterval = null;
  let pendingAiReminder = null;

  function initReminderSystem() {
    reminders = Array.isArray(reminders) ? reminders.filter(item => item && item.id && item.title && Number.isFinite(new Date(item.dueAt).getTime())) : [];
    reminders.forEach(item => {
      if (!item.status) item.status = 'scheduled';
      if (!item.repeat) item.repeat = 'none';
    });
    renderReminderCenter();
    updateReminderPermissionUI();
    checkDueReminders();
    reminderInterval = window.setInterval(checkDueReminders, 15000);
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        checkDueReminders();
        if (!('Notification' in window) || Notification.permission !== 'granted') {
          reminders.filter(item => item.alertPending && !item.foregroundNotified).forEach(item => {
            showToast(`Reminder: ${item.title}`, 'toast-info');
            item.foregroundNotified = true;
          });
          saveReminders();
        }
      }
    });
    window.addEventListener('storage', event => {
      if (event.key === STORAGE_KEYS.REMINDERS) {
        try { reminders = event.newValue ? JSON.parse(event.newValue) : []; } catch { reminders = []; }
        renderReminderCenter();
        renderKanban();
      }
    });
  }

  function reminderTaskName(taskId) {
    return tasks.find(task => task.id === taskId)?.title || '';
  }

  function updateReminderPermissionUI() {
    if (!('Notification' in window)) {
      dom.reminderPermissionStatus.textContent = 'Browser notifications are not supported here';
      dom.enableNotificationsBtn.disabled = true;
      return;
    }
    const permission = Notification.permission;
    dom.reminderPermissionStatus.textContent = permission === 'granted' ? 'Browser notifications are enabled' : permission === 'denied' ? 'Notifications are blocked in browser settings' : 'Browser notifications are off';
    dom.enableNotificationsBtn.textContent = permission === 'granted' ? 'Notifications enabled' : permission === 'denied' ? 'Permission blocked' : 'Enable notifications';
    dom.enableNotificationsBtn.disabled = permission !== 'default';
  }

  async function requestReminderPermission() {
    if (!('Notification' in window)) {
      showToast('This browser does not support notifications', 'toast-warning');
      return;
    }
    try {
      const permission = await Notification.requestPermission();
      updateReminderPermissionUI();
      showToast(permission === 'granted' ? 'Browser reminders enabled' : 'Browser permission was not granted', permission === 'granted' ? 'toast-success' : 'toast-warning');
      if (permission === 'granted') checkDueReminders();
    } catch (error) {
      showToast('Could not request notification permission', 'toast-warning');
    }
  }

  function notifyReminder(reminder) {
    const taskName = reminderTaskName(reminder.taskId);
    const body = taskName ? `${reminder.title} · ${taskName}` : reminder.title;
    if ('Notification' in window && Notification.permission === 'granted') {
      try {
        const notification = new Notification('Aegis Flow reminder', { body, tag: `aegis-${reminder.id}` });
        notification.onclick = () => {
          window.focus();
          openReminderCenter();
          notification.close();
        };
      } catch (error) {
        if (!document.hidden) {
          showToast(`Reminder: ${reminder.title}`, 'toast-info');
          reminder.foregroundNotified = true;
        }
      }
    } else if (!document.hidden) {
      showToast(`Reminder: ${reminder.title}`, 'toast-info');
      reminder.foregroundNotified = true;
    }
  }

  function checkDueReminders() {
    const now = Date.now();
    let changed = false;
    reminders.forEach(reminder => {
      if (reminder.status === 'dismissed') return;
      const snoozedTime = reminder.snoozedUntil ? new Date(reminder.snoozedUntil).getTime() : NaN;
      if (Number.isFinite(snoozedTime) && snoozedTime <= now) {
        reminder.snoozedUntil = null;
        reminder.alertPending = true;
        reminder.foregroundNotified = false;
        if (reminder.repeat === 'none') reminder.status = 'triggered';
        reminder.lastTriggeredAt = new Date(now).toISOString();
        notifyReminder(reminder);
        changed = true;
        return;
      }
      const dueTime = new Date(reminder.dueAt).getTime();
      if (reminder.status !== 'scheduled' || !Number.isFinite(dueTime) || dueTime > now) return;
      reminder.lastTriggeredAt = new Date(now).toISOString();
      reminder.snoozedUntil = null;
      reminder.alertPending = true;
      reminder.foregroundNotified = false;
      notifyReminder(reminder);
      if (reminder.repeat === 'none') {
        reminder.status = 'triggered';
      } else {
        let next = new Date(dueTime);
        let guard = 0;
        do { next = nextReminderOccurrence(next, reminder.repeat); guard += 1; } while (next.getTime() <= now && guard < 12000);
        reminder.dueAt = next.toISOString();
      }
      changed = true;
    });
    if (changed) {
      saveReminders();
      renderReminderCenter();
    }
  }

  function nextReminderOccurrence(date, repeat) {
    const next = new Date(date);
    if (repeat === 'daily') next.setDate(next.getDate() + 1);
    else if (repeat === 'weekly') next.setDate(next.getDate() + 7);
    else if (repeat === 'weekdays') {
      do { next.setDate(next.getDate() + 1); } while (next.getDay() === 0 || next.getDay() === 6);
    } else if (repeat === 'monthly') {
      const day = next.getDate();
      next.setDate(1);
      next.setMonth(next.getMonth() + 1);
      const lastDay = new Date(next.getFullYear(), next.getMonth() + 1, 0).getDate();
      next.setDate(Math.min(day, lastDay));
    }
    return next;
  }

  function openReminderCenter() {
    renderReminderCenter();
    updateReminderPermissionUI();
    openModal(dom.reminderCenterModal);
  }

  function renderReminderCenter() {
    if (!dom.reminderList) return;
    const visible = reminders.filter(item => item.status !== 'dismissed').sort((a, b) => {
      const aTime = a.snoozedUntil || a.dueAt;
      const bTime = b.snoozedUntil || b.dueAt;
      return new Date(aTime) - new Date(bTime);
    });
    const triggeredCount = visible.filter(item => item.status === 'triggered' || item.alertPending).length;
    dom.reminderCountBadge.hidden = triggeredCount === 0;
    dom.reminderCountBadge.textContent = triggeredCount > 9 ? '9+' : String(triggeredCount);
    if (!visible.length) {
      dom.reminderList.innerHTML = '<div class="reminder-empty"><span class="reminder-empty-mark">—</span><strong>No reminders scheduled</strong><span>Your upcoming reminders will appear here.</span></div>';
      return;
    }
    dom.reminderList.innerHTML = visible.map(reminder => {
      const when = reminder.snoozedUntil || reminder.dueAt;
      const isTriggered = reminder.status === 'triggered' || reminder.alertPending;
      const taskName = reminderTaskName(reminder.taskId);
      const repeatLabel = { none: 'Once', daily: 'Daily', weekdays: 'Weekdays', weekly: 'Weekly', monthly: 'Monthly' }[reminder.repeat] || 'Once';
      const whenText = isTriggered ? `Due ${formatReminderDate(reminder.lastTriggeredAt || reminder.dueAt)}` : `${reminder.snoozedUntil ? 'Snoozed · ' : ''}${formatReminderDate(when)}`;
      return `<article class="reminder-row ${isTriggered ? 'is-triggered' : ''}" data-reminder-id="${escapeHtml(reminder.id)}">
        <span class="reminder-row-mark" aria-hidden="true"></span>
        <div class="reminder-row-main"><strong>${escapeHtml(reminder.title)}</strong><span>${escapeHtml(whenText)} · ${repeatLabel}${taskName ? ` · ${escapeHtml(taskName)}` : ''}</span></div>
        <div class="reminder-row-actions">
          ${isTriggered ? '<button type="button" class="reminder-row-btn" data-action="snooze">Snooze 10m</button><button type="button" class="reminder-row-btn" data-action="dismiss">Dismiss</button>' : '<button type="button" class="reminder-row-btn" data-action="edit">Edit</button>'}
          <button type="button" class="reminder-row-icon" data-action="delete" aria-label="Delete reminder" title="Delete reminder">×</button>
        </div>
      </article>`;
    }).join('');
  }

  function formatReminderDate(value) {
    const date = new Date(value);
    if (!Number.isFinite(date.getTime())) return 'Invalid time';
    return date.toLocaleString(undefined, { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
  }

  function localDateTimeValue(date) {
    const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
    return local.toISOString().slice(0, 16);
  }

  function populateReminderTaskSelect(selectedId = '') {
    dom.reminderTaskSelect.innerHTML = '<option value="">No task</option>' + tasks.map(task => `<option value="${escapeHtml(task.id)}">${escapeHtml(task.title)}</option>`).join('');
    dom.reminderTaskSelect.value = tasks.some(task => task.id === selectedId) ? selectedId : '';
  }

  function openCreateReminder(taskId = '') {
    dom.reminderForm.reset();
    dom.reminderFormId.value = '';
    dom.reminderModalTitle.textContent = 'New reminder';
    dom.reminderRepeatSelect.value = 'none';
    dom.reminderDateInput.value = localDateTimeValue(new Date(Date.now() + 60 * 60 * 1000));
    populateReminderTaskSelect(taskId);
    dom.reminderNaturalInput.value = '';
    dom.aiReminderPreview.hidden = true;
    pendingAiReminder = null;
    openModal(dom.reminderModal);
    setTimeout(() => dom.reminderTitleInput.focus(), 50);
  }

  function openEditReminder(id) {
    const reminder = reminders.find(item => item.id === id);
    if (!reminder) return;
    dom.reminderForm.reset();
    dom.reminderFormId.value = reminder.id;
    dom.reminderModalTitle.textContent = 'Edit reminder';
    dom.reminderTitleInput.value = reminder.title;
    dom.reminderDateInput.value = localDateTimeValue(new Date(reminder.dueAt));
    dom.reminderRepeatSelect.value = reminder.repeat || 'none';
    populateReminderTaskSelect(reminder.taskId || '');
    dom.reminderNaturalInput.value = '';
    dom.aiReminderPreview.hidden = true;
    pendingAiReminder = null;
    closeModal(dom.reminderCenterModal);
    openModal(dom.reminderModal);
  }

  function saveReminder({ title, dueAt, repeat = 'none', taskId = '', id = '' }) {
    const dueDate = new Date(dueAt);
    if (!title.trim() || !Number.isFinite(dueDate.getTime()) || dueDate.getTime() <= Date.now()) {
      showToast('Choose a reminder time in the future', 'toast-warning');
      return false;
    }
    const linkedTask = tasks.some(task => task.id === taskId);
    if (id) {
      const reminder = reminders.find(item => item.id === id);
      if (!reminder) return false;
      Object.assign(reminder, { title: title.trim(), dueAt: dueDate.toISOString(), repeat, taskId: linkedTask ? taskId : '', status: 'scheduled', snoozedUntil: null, alertPending: false, foregroundNotified: false });
    } else {
      reminders.push({ id: `rem-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, title: title.trim(), dueAt: dueDate.toISOString(), repeat, taskId: linkedTask ? taskId : '', status: 'scheduled', snoozedUntil: null, createdAt: new Date().toISOString() });
    }
    saveReminders();
    renderReminderCenter();
    renderKanban();
    return true;
  }

  function handleReminderFormSubmit(event) {
    event.preventDefault();
    const saved = saveReminder({
      id: dom.reminderFormId.value,
      title: dom.reminderTitleInput.value,
      dueAt: dom.reminderDateInput.value,
      repeat: dom.reminderRepeatSelect.value,
      taskId: dom.reminderTaskSelect.value
    });
    if (saved) {
      closeModal(dom.reminderModal);
      openReminderCenter();
      showToast('Reminder saved', 'toast-success');
    }
  }

  function handleReminderRowAction(event) {
    const button = event.target.closest('[data-action]');
    const row = event.target.closest('[data-reminder-id]');
    if (!button || !row) return;
    const reminder = reminders.find(item => item.id === row.dataset.reminderId);
    if (!reminder) return;
    if (button.dataset.action === 'edit') return openEditReminder(reminder.id);
    if (button.dataset.action === 'snooze') {
      reminder.snoozedUntil = new Date(Date.now() + 10 * 60 * 1000).toISOString();
      reminder.alertPending = false;
      reminder.foregroundNotified = false;
      if (reminder.repeat === 'none') reminder.status = 'scheduled';
      saveReminders();
      renderReminderCenter();
      showToast('Reminder snoozed for 10 minutes', 'toast-info');
    } else if (button.dataset.action === 'dismiss') {
      reminder.status = reminder.repeat === 'none' ? 'dismissed' : 'scheduled';
      reminder.snoozedUntil = null;
      reminder.alertPending = false;
      saveReminders();
      renderReminderCenter();
    } else if (button.dataset.action === 'delete') {
      reminders = reminders.filter(item => item.id !== reminder.id);
      saveReminders();
      renderReminderCenter();
    }
  }

  function parseReminderRequest(text) {
    const raw = text.trim();
    if (!raw) return null;
    const lower = raw.toLowerCase();
    const date = new Date();
    date.setSeconds(0, 0);
    let dateFound = false;
    let timeFound = false;
    const repeatMatch = lower.match(/\b(every\s+day|daily|weekdays|every\s+weekday|weekly|every\s+week|monthly|every\s+month)\b/);
    const repeat = !repeatMatch ? 'none' : /daily|every\s+day/.test(repeatMatch[0]) ? 'daily' : /weekday/.test(repeatMatch[0]) ? 'weekdays' : /weekly|every\s+week/.test(repeatMatch[0]) ? 'weekly' : 'monthly';
    const relative = lower.match(/\bin\s+(\d+)\s+(minutes?|mins?|hours?|days?)\b/);
    let timeMatch = null;
    if (relative) {
      const amount = Number(relative[1]);
      const unit = relative[2];
      date.setTime(Date.now() + amount * (/min/.test(unit) ? 60000 : /hour/.test(unit) ? 3600000 : 86400000));
      dateFound = timeFound = true;
    } else {
      if (/\btomorrow\b/.test(lower)) { date.setDate(date.getDate() + 1); dateFound = true; }
      else if (/\btoday\b/.test(lower)) dateFound = true;
      else {
        const weekday = lower.match(/\b(?:next\s+)?(sunday|monday|tuesday|wednesday|thursday|friday|saturday)\b/);
        if (weekday) {
          const names = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
          let delta = (names.indexOf(weekday[1]) - date.getDay() + 7) % 7;
          if (!delta || /^next\s/.test(weekday[0])) delta += 7;
          date.setDate(date.getDate() + delta);
          dateFound = true;
        } else {
          const monthDay = lower.match(/\b(?:on\s+)?(jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sep(?:tember)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?)\s+(\d{1,2})\b/);
          if (monthDay) {
            const parsed = new Date(`${monthDay[1]} ${monthDay[2]}, ${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`);
            if (Number.isFinite(parsed.getTime())) {
              if (parsed.getTime() <= Date.now()) parsed.setFullYear(parsed.getFullYear() + 1);
              date.setTime(parsed.getTime());
              dateFound = true;
            }
          }
        }
      }
      timeMatch = lower.match(/\b(?:at\s*)?(\d{1,2})(?::(\d{2}))?\s*(a\.?m\.?|p\.?m\.?)\b/) || lower.match(/\bat\s+(\d{1,2}):(\d{2})\b/);
      if (timeMatch) {
        let hour = Number(timeMatch[1]);
        const minute = Number(timeMatch[2] || 0);
        const suffix = (timeMatch[3] || '').replace(/\./g, '');
        if (suffix.startsWith('p') && hour < 12) hour += 12;
        if (suffix.startsWith('a') && hour === 12) hour = 0;
        date.setHours(hour, minute, 0, 0);
        timeFound = true;
      }
      if (repeat !== 'none' && timeFound && !dateFound) dateFound = true;
      if (!dateFound || !timeFound) return null;
      if (date.getTime() <= Date.now() && /\btoday\b/.test(lower)) date.setDate(date.getDate() + 1);
    }
    if (repeat === 'weekdays' && (date.getDay() === 0 || date.getDay() === 6)) {
      do { date.setDate(date.getDate() + 1); } while (date.getDay() === 0 || date.getDay() === 6);
    }
    if (date.getTime() <= Date.now()) {
      if (repeat === 'none') return null;
      let next = new Date(date);
      do { next = nextReminderOccurrence(next, repeat); } while (next.getTime() <= Date.now());
      date.setTime(next.getTime());
    }
    let title = raw.replace(/^\s*(?:hey\s+)?aegis[, :]?\s*/i, '').replace(/\bremind\s+me\b/i, '');
    title = title.replace(/\bin\s+\d+\s+(?:minutes?|mins?|hours?|days?)\b/i, '');
    title = title.replace(/\b(?:today|tomorrow)\b/i, '').replace(/\bnext\s+(?:sunday|monday|tuesday|wednesday|thursday|friday|saturday)\b/i, '').replace(/\b(?:sunday|monday|tuesday|wednesday|thursday|friday|saturday)\b/i, '');
    title = title.replace(/\b(?:on\s+)?(?:jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sep(?:tember)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?)\s+\d{1,2}\b/i, '');
    title = title.replace(/\b(?:at\s*)?\d{1,2}(?::\d{2})?\s*(?:a\.?m\.?|p\.?m\.?)\b/i, '').replace(/\bat\s+\d{1,2}:\d{2}\b/i, '');
    title = title.replace(/\b(?:every\s+day|daily|weekdays|every\s+weekday|weekly|every\s+week|monthly|every\s+month)\b/i, '');
    title = title.replace(/^\s*(?:to|that\s+i|about)\s+/i, '').replace(/\s+/g, ' ').replace(/[.,!?]+$/, '').trim();
    if (!title) return null;
    const linkedTask = tasks.find(task => lower.includes(task.title.toLowerCase()));
    return { title, dueAt: date.toISOString(), repeat, taskId: linkedTask?.id || '' };
  }

  function previewReminderRequest() {
    const parsed = parseReminderRequest(dom.reminderNaturalInput.value);
    if (!parsed) {
      pendingAiReminder = null;
      dom.aiReminderPreview.hidden = true;
      showToast('Include a clear date and time, such as tomorrow at 7 PM', 'toast-warning');
      return;
    }
    pendingAiReminder = parsed;
    const repeatText = { none: 'one time', daily: 'daily', weekdays: 'on weekdays', weekly: 'weekly', monthly: 'monthly' }[parsed.repeat];
    const task = reminderTaskName(parsed.taskId);
    dom.aiReminderSummary.textContent = `${parsed.title} · ${formatReminderDate(parsed.dueAt)} · ${repeatText}${task ? ` · ${task}` : ''}`;
    dom.aiReminderPreview.hidden = false;
  }

  function confirmAiReminder() {
    if (!pendingAiReminder) return;
    if (!saveReminder(pendingAiReminder)) return;
    pendingAiReminder = null;
    closeModal(dom.reminderModal);
    openReminderCenter();
    showToast('Aegis reminder confirmed', 'toast-success');
  }

  function openAiReminder() {
    openCreateReminder();
    setTimeout(() => dom.reminderNaturalInput.focus(), 60);
  }

  // --- EVENT LISTENERS ---
  function setupEventListeners() {
    // Mobile navigation drawer
    dom.mobileMenuBtn.addEventListener('click', () => {
      dom.sidebar.classList.toggle('open');
      dom.sidebarBackdrop.classList.toggle('active');
    });

    dom.sidebarBackdrop.addEventListener('click', () => {
      dom.sidebar.classList.remove('open');
      dom.sidebarBackdrop.classList.remove('active');
    });

    // Close mobile drawer on navigation click
    document.querySelectorAll('.sidebar-nav .nav-item').forEach(item => {
      item.addEventListener('click', () => {
        document.querySelectorAll('.sidebar-nav .nav-item').forEach(i => i.classList.remove('active'));
        item.classList.add('active');
        if (window.innerWidth <= 768) {
          dom.sidebar.classList.remove('open');
          dom.sidebarBackdrop.classList.remove('active');
        }
      });
    });

    // Global keyboard triggers (Ctrl+K or /)
    window.addEventListener('keydown', (e) => {
      // Ctrl+K or Cmd+K
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (dom.commandPalette.classList.contains('active')) {
          closeCommandPalette();
        } else {
          openCommandPalette();
        }
        return;
      }

      // / to focus search or open palette if not in an input
      if (e.key === '/' && !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
        e.preventDefault();
        openCommandPalette();
        return;
      }

      // Escape closes open modals & palette
      if (e.key === 'Escape') {
        if (dom.commandPalette.classList.contains('active')) closeCommandPalette();
        [dom.taskModal, dom.noteModal, dom.deadlineModal, dom.confirmModal, dom.reminderModal, dom.reminderCenterModal].forEach(m => {
          if (m && m.classList.contains('active')) closeModal(m);
        });
      }
    });

    // Command palette openers
    dom.sidebarCommandBtn.addEventListener('click', openCommandPalette);
    dom.openCommandPaletteBtn.addEventListener('click', openCommandPalette);
    dom.mobilePaletteBtn.addEventListener('click', openCommandPalette);

    dom.commandPalette.addEventListener('click', (e) => {
      if (e.target === dom.commandPalette) closeCommandPalette();
    });

    // Global Search Bar filter
    dom.globalSearchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      renderKanban();
      renderNotes();
    });

    // Task modal triggers
    dom.openNewTaskModalBtn.addEventListener('click', () => openCreateTaskModal('todo'));
    dom.boardQuickAddTaskBtn.addEventListener('click', () => openCreateTaskModal('todo'));
    dom.closeTaskModalBtn.addEventListener('click', () => closeModal(dom.taskModal));
    dom.cancelTaskBtn.addEventListener('click', () => closeModal(dom.taskModal));
    dom.taskForm.addEventListener('submit', handleTaskFormSubmit);

    dom.openReminderCenterBtn.addEventListener('click', openReminderCenter);
    dom.closeReminderCenterBtn.addEventListener('click', () => closeModal(dom.reminderCenterModal));
    dom.reminderCenterModal.addEventListener('click', event => {
      if (event.target === dom.reminderCenterModal) closeModal(dom.reminderCenterModal);
    });
    dom.reminderList.addEventListener('click', handleReminderRowAction);
    dom.enableNotificationsBtn.addEventListener('click', requestReminderPermission);
    dom.newReminderBtn.addEventListener('click', () => {
      closeModal(dom.reminderCenterModal);
      openCreateReminder();
    });
    dom.closeReminderModalBtn.addEventListener('click', () => closeModal(dom.reminderModal));
    dom.cancelReminderBtn.addEventListener('click', () => closeModal(dom.reminderModal));
    dom.reminderModal.addEventListener('click', event => {
      if (event.target === dom.reminderModal) closeModal(dom.reminderModal);
    });
    dom.reminderForm.addEventListener('submit', handleReminderFormSubmit);
    dom.interpretReminderBtn.addEventListener('click', previewReminderRequest);
    dom.reminderNaturalInput.addEventListener('input', () => {
      pendingAiReminder = null;
      dom.aiReminderPreview.hidden = true;
    });
    dom.reminderNaturalInput.addEventListener('keydown', event => {
      if (event.key === 'Enter') { event.preventDefault(); previewReminderRequest(); }
    });
    dom.confirmAiReminderBtn.addEventListener('click', confirmAiReminder);

    // Quick add button on each column header
    document.querySelectorAll('.col-add-trigger').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const status = btn.getAttribute('data-add-status') || 'todo';
        openCreateTaskModal(status);
      });
    });

    // Board Filter Pills
    dom.filterPills.forEach(pill => {
      pill.addEventListener('click', () => {
        const filterName = pill.getAttribute('data-filter') || 'all';
        setFilter(filterName);
      });
    });

    // Export Sprint Tasks
    if (dom.exportTasksBtn) {
      dom.exportTasksBtn.addEventListener('click', exportTasksJSON);
    }

    // Notes triggers
    dom.openNewNoteModalBtn.addEventListener('click', openCreateNoteModal);
    dom.addNoteTriggerBtn.addEventListener('click', openCreateNoteModal);
    dom.closeNoteModalBtn.addEventListener('click', () => closeModal(dom.noteModal));
    dom.cancelNoteBtn.addEventListener('click', () => closeModal(dom.noteModal));
    dom.noteForm.addEventListener('submit', handleNoteFormSubmit);

    // Deadline modal triggers
    dom.openDeadlineModalBtn.addEventListener('click', openEditDeadlineModal);
    dom.closeDeadlineModalBtn.addEventListener('click', () => closeModal(dom.deadlineModal));
    dom.cancelDeadlineBtn.addEventListener('click', () => closeModal(dom.deadlineModal));
    dom.deadlineForm.addEventListener('submit', handleDeadlineFormSubmit);

    // Deadline presets
    dom.presetDefaultBtn.addEventListener('click', () => {
      const defaultDate = new Date(DEFAULT_DEADLINE_ISO);
      const localIso = new Date(defaultDate.getTime() - (defaultDate.getTimezoneOffset() * 60000)).toISOString().slice(0, 16);
      dom.deadlineDatetimeInput.value = localIso;
    });

    document.querySelectorAll('.preset-chip[data-hours]').forEach(chip => {
      chip.addEventListener('click', () => {
        const hours = parseInt(chip.getAttribute('data-hours'), 10);
        applyDeadlinePreset(hours);
      });
    });

    // Confirm dialog buttons
    dom.confirmCancelBtn.addEventListener('click', () => closeModal(dom.confirmModal));
    dom.confirmProceedBtn.addEventListener('click', () => {
      closeModal(dom.confirmModal);
      if (typeof pendingConfirmAction === 'function') {
        pendingConfirmAction();
        pendingConfirmAction = null;
      }
    });

    // Reset Demo State
    dom.resetDemoBtn.addEventListener('click', resetToDefaults);

    // Clear Activity Feed
    dom.clearActivityBtn.addEventListener('click', clearActivityFeed);

    // Export Activity Feed
    if (dom.exportActivityBtn) {
      dom.exportActivityBtn.addEventListener('click', exportActivityFeed);
    }

    // Activity Filter Pills
    document.querySelectorAll('[data-activity-filter]').forEach(pill => {
      pill.addEventListener('click', () => {
        const filterName = pill.getAttribute('data-activity-filter');
        if (filterName) setActivityFilter(filterName);
      });
    });

    // Close modals on clicking overlay backdrop
    [dom.taskModal, dom.noteModal, dom.deadlineModal, dom.confirmModal].forEach(modal => {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal(modal);
      });
    });
  }

  // --- UTILITY FUNCTIONS ---
  function formatStatusName(status) {
    if (status === 'todo') return 'To Do';
    if (status === 'in-progress') return 'In Progress';
    if (status === 'review') return 'Review & QA';
    if (status === 'done') return 'Done';
    return status;
  }

  function getInitials(name) {
    if (!name) return '??';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }

  function escapeHtml(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
