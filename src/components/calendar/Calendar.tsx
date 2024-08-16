import { useEffect, useState } from 'react';
import './Calendar.css';
import CalendarMonth from './CalendarMonth';

export default function Calendar({ date, handleDateClick }: { date: Date; handleDateClick: (date: Date) => void }) {
  const today = new Date();

  const [calendarMonthCount, setCalendarMonthCount] = useState(0);
  const [month, setMount] = useState(today.getMonth());

  useEffect(() => {
    const updateCalendarMountCount = () => {
      const height = window.innerHeight - 90;
      const calendarMonthSize = 264;
      const newCalendarMonthCount = Math.floor(height / calendarMonthSize);
      setCalendarMonthCount(newCalendarMonthCount);
    };

    // Init
    updateCalendarMountCount();

    // update on window resize
    window.addEventListener('resize', updateCalendarMountCount);

    // cleanup
    return () => {
      window.removeEventListener('resize', updateCalendarMountCount);
    };
  }, [month]);

  const year = today.getFullYear();

  const months = Array.from({ length: calendarMonthCount }, (_, index) => (
    <CalendarMonth
      key={month - (calendarMonthCount - index - 1)}
      today={today}
      year={year}
      month={month - (calendarMonthCount - index - 1)}
      selectedDate={date}
      handleDateClick={handleDateClick}
    />
  ));

  const handleScroll = (event: any) => {
    if (event.deltaY < 0) {
      if (month >= -222) setMount(month - 1);
    } else if (event.deltaY > 0) {
      if (month < today.getMonth()) setMount(month + 1);
    }
  }

  return (
    <div onWheel={handleScroll} className="calendar-container">
      <button className="calendar-button" onClick={() => {
        if (month >= -222) setMount(month - 1);
      }}>
        ▲
      </button>
      {months}
      <button
        className="calendar-button"
        onClick={() => {
          if (month < today.getMonth()) setMount(month + 1);
        }}
      >
        ▼
      </button>
    </div>
  );
}
