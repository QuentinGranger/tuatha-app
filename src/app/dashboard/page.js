'use client';
import React from 'react';
import ActivePatientsList from './components/ActivePatientsList';
import Calendar from './components/Calendar';
import TodoList from './components/TodoList';
import './page.css';

export default function DashboardPage() {
  return (
    <div className="dashboard-wrapper">
      <div className="activePatients">
        <ActivePatientsList />
      </div>
      <div className="calendar">
        <Calendar />
      </div>
      <div className="toDoList">
        <TodoList />
      </div>
    </div>
  );
}
