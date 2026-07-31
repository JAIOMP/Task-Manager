import type { Task } from '@/configs/types';

function formatICSDateTime(d: Date): string {
  return d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
}

function formatICSDate(d: Date): string {
  return formatICSDateTime(d);
}

export function generateICS(task: Task): string {
  const now = new Date();
  const stamp = formatICSDate(now);

  let dtstart: string;
  let dtend: string;
  let alarmTrigger: string;

  if (task.dueTime) {
    const start = new Date(`${task.dueDate}T${task.dueTime}:00`);
    const end = new Date(start.getTime() + 60 * 60 * 1000);
    dtstart = `DTSTART:${formatICSDateTime(start)}`;
    dtend = `DTEND:${formatICSDateTime(end)}`;
    alarmTrigger = 'TRIGGER:-PT30M';
  } else {
    const dateOnly = task.dueDate!.replace(/-/g, '');
    dtstart = `DTSTART;VALUE=DATE:${dateOnly}`;
    dtend = `DTEND;VALUE=DATE:${dateOnly}`;
    alarmTrigger = `TRIGGER;VALUE=DATE-TIME:${dateOnly}T090000Z`;
  }

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Todolo//Task Reminder//EN',
    'BEGIN:VEVENT',
    `UID:${task.id}@todolo`,
    `DTSTAMP:${stamp}`,
    dtstart,
    dtend,
    `SUMMARY:${task.title}`,
    task.description ? `DESCRIPTION:${task.description.replace(/\n/g, '\\n')}` : '',
    'BEGIN:VALARM',
    'ACTION:DISPLAY',
    `DESCRIPTION:Reminder: ${task.title}`,
    alarmTrigger,
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ]
    .filter(Boolean)
    .join('\r\n');
}

export function downloadICS(task: Task): void {
  const content = generateICS(task);
  const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${task.title.replace(/[^a-z0-9]/gi, '_')}_reminder.ics`;
  a.click();
  URL.revokeObjectURL(url);
}
