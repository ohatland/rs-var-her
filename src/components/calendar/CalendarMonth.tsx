export default function CalendarMonth({
  today,
  year,
  month,
  selectedDate,
  handleDateClick,
}: {
  today: Date;
  year: number;
  month: number;
  selectedDate: Date;
  handleDateClick: (date: Date) => void;
}) {
  const firstDay = new Date(year, month, 1);
  const daysBeforeTheMonthStart = Array.from({ length: firstDay.getDay() - 1 }, (_, i) => i);

  const lastDay = new Date(year, month + 1, 0);
  const days = Array.from({ length: lastDay.getDate() }, (_, i) => i);

  let formattedDate = firstDay.toLocaleString('no', {
    month: 'long',
    year: 'numeric',
  });
  formattedDate = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);

  return (
    <div className="calendar">
      <header>
        <div className="header-display">
          <p className="display">{formattedDate}</p>
        </div>
      </header>

      <div className="week">
        <div>Ma</div>
        <div>Ti</div>
        <div>On</div>
        <div>To</div>
        <div>Fr</div>
        <div>Lø</div>
        <div>Sø</div>
      </div>

      <div className="days">
        {daysBeforeTheMonthStart.map((i) => {
          return (
            <div key={i} className="disabled" style={{ color: 'white' }}>
              0
            </div>
          );
        })}
        {days.map((date) => {
          const currentDate = new Date(year, month, date + 1);
          const isSelected =
            selectedDate &&
            selectedDate.getFullYear() === currentDate.getFullYear() &&
            selectedDate.getMonth() === currentDate.getMonth() &&
            selectedDate.getDate() === currentDate.getDate();
          if (currentDate > today) {
            return (
              <div key={date} className="disabled">
                {date + 1}
              </div>
            );
          // } else if (currentDate.getTime() < today.getTime() - 612794741959) {
          } else if (currentDate.getTime() < today.getTime() - 612831600000) {
            return (
              <div key={date} className="disabled">
                {date + 1}
              </div>
            );
          } else {
            // console.log('t', currentDate.getTime(), 'date', currentDate.getDate(), 'mounth', currentDate.getMonth(), 'diff', today.getTime()-currentDate.getTime())
            return (
              <div key={date} data-date={currentDate} className={isSelected ? 'selected' : ''} onClick={() => handleDateClick(currentDate)}>
                {date + 1}
              </div>
            );
          }
        })}
      </div>
    </div>
  );
}