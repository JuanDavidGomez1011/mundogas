import { businessData } from '../data/businessData';

export interface BusinessStatus {
  isOpen: boolean;
  message: string;
  nextStatusChange: string;
}

/**
 * Checks if the store is currently open based on Colombia time
 */
export function getBusinessStatus(): BusinessStatus {
  try {
    // Get current date/time in Colombia timezone (GMT-5)
    const options = { timeZone: businessData.schedule.timezone };
    const colombiaString = new Date().toLocaleString('en-US', options);
    const colombiaDate = new Date(colombiaString);

    const dayOfWeek = colombiaDate.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    const currentHour = colombiaDate.getHours();
    const currentMinute = colombiaDate.getMinutes();
    const currentTimeInMinutes = currentHour * 60 + currentMinute;

    // Find the schedule configuration for the current day
    const schedule = businessData.schedule;
    let activeRanges: { start: string; end: string }[] = [];

    if (dayOfWeek >= 1 && dayOfWeek <= 5) {
      // Weekdays
      const config = schedule.weekdays[0];
      activeRanges = config.ranges;
    } else if (dayOfWeek === 6) {
      // Saturdays
      const config = schedule.saturdays[0];
      activeRanges = config.ranges;
    } else {
      // Sundays
      const config = schedule.sundays[0];
      activeRanges = config.ranges;
    }

    if (activeRanges.length === 0) {
      return {
        isOpen: false,
        message: 'Cerrado ahora (Domingos y festivos sin servicio al público)',
        nextStatusChange: 'Abre el Lunes a las 08:00 AM'
      };
    }

    // Check if the current time is within any of the open ranges
    for (const range of activeRanges) {
      const [startH, startM] = range.start.split(':').map(Number);
      const [endH, endM] = range.end.split(':').map(Number);

      const startMinutes = startH * 60 + startM;
      const endMinutes = endH * 60 + endM;

      if (currentTimeInMinutes >= startMinutes && currentTimeInMinutes < endMinutes) {
        // Formatear hora de cierre para mostrar al usuario
        const closeH12 = endH > 12 ? endH - 12 : endH;
        const closeAmPm = endH >= 12 ? 'PM' : 'AM';
        const closeMinutesFormatted = endM.toString().padStart(2, '0');
        
        return {
          isOpen: true,
          message: `Abierto ahora • Cierra a las ${closeH12}:${closeMinutesFormatted} ${closeAmPm}`,
          nextStatusChange: `Cierra a las ${closeH12}:${closeMinutesFormatted} ${closeAmPm}`
        };
      }
    }

    // If we get here, it's a working day but outside business hours
    // Find if we are before the first range or after the last
    const firstRange = activeRanges[0];
    const [firstStartH, firstStartM] = firstRange.start.split(':').map(Number);
    const firstStartMinutes = firstStartH * 60 + firstStartM;

    if (currentTimeInMinutes < firstStartMinutes) {
      const startH12 = firstStartH > 12 ? firstStartH - 12 : firstStartH;
      const startAmPm = firstStartH >= 12 ? 'PM' : 'AM';
      const startMinutesFormatted = firstStartM.toString().padStart(2, '0');
      
      return {
        isOpen: false,
        message: 'Cerrado ahora',
        nextStatusChange: `Abre hoy a las ${startH12}:${startMinutesFormatted} ${startAmPm}`
      };
    } else {
      // Determine what day is tomorrow
      let nextDayMsg = 'Abre mañana a las 08:00 AM';
      if (dayOfWeek === 5) {
        nextDayMsg = 'Abre el Sábado a las 08:00 AM';
      } else if (dayOfWeek === 6) {
        nextDayMsg = 'Abre el Lunes a las 08:00 AM';
      }
      return {
        isOpen: false,
        message: 'Cerrado ahora',
        nextStatusChange: nextDayMsg
      };
    }
  } catch (error) {
    // Fallback if timezone calculation fails
    return {
      isOpen: true,
      message: 'Abierto en horario comercial habitual',
      nextStatusChange: 'Lunes a Sábado'
    };
  }
}
