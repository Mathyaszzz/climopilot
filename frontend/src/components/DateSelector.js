import React from 'react';
import { Calendar } from 'lucide-react';

const DateSelector = ({ onDateSelect, selectedDate }) => {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const handleDateChange = (field, value) => {
    const newDate = { ...selectedDate, [field]: parseInt(value) };
    onDateSelect(newDate);
  };

  const getDaysInMonth = (month, year) => {
    return new Date(year, month, 0).getDate();
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear - 5 + i);

  return (
    <div className="input-group">
      <label className="input-label">
        <Calendar size={16} style={{ marginRight: '8px', display: 'inline' }} />
        Select Date
      </label>
      
      <div className="date-inputs">
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#4a5568' }}>
            Month
          </label>
          <select
            value={selectedDate.month}
            onChange={(e) => handleDateChange('month', e.target.value)}
            className="date-input"
          >
            {months.map((month, index) => (
              <option key={index} value={index + 1}>
                {month}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#4a5568' }}>
            Day
          </label>
          <select
            value={selectedDate.day}
            onChange={(e) => handleDateChange('day', e.target.value)}
            className="date-input"
          >
            {Array.from({ length: getDaysInMonth(selectedDate.month, selectedDate.year) }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#4a5568' }}>
            Year
          </label>
          <select
            value={selectedDate.year}
            onChange={(e) => handleDateChange('year', e.target.value)}
            className="date-input"
          >
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div style={{ 
        marginTop: '1rem', 
        padding: '1rem', 
        background: '#f7fafc', 
        borderRadius: '8px',
        border: '1px solid #e2e8f0',
        textAlign: 'center'
      }}>
        <strong>Selected Date:</strong> {months[selectedDate.month - 1]} {selectedDate.day}, {selectedDate.year}
        <br />
        <small style={{ color: '#4a5568' }}>
          This will analyze historical climate data for this date across multiple years
        </small>
      </div>
    </div>
  );
};

export default DateSelector;
