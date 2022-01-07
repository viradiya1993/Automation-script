import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'datesDiff'
})
export class DatesDiffPipe implements PipeTransform {

  transform(startDate: any, endDate: any): any {
    startDate = new Date(startDate);
    endDate = new Date(endDate);

    if (isNaN(startDate) || isNaN(endDate) || (startDate > endDate)) {
      return;
    }

    var deltaSeconds = ((endDate - startDate) / 1000);
    return this.format(this.calculateWeeksDaysHoursMinutesSeconds(deltaSeconds));
  }

  private calculateDaysHoursMinutesSeconds(delta: number): number[] {
    var days = Math.floor(delta / 60 / 60 / 24);
    var remainder = (delta - (days * 60 * 60 * 24));
    return ([days, ...this.calculateHoursMinutesSeconds(remainder)]);
  }

  private calculateHoursMinutesSeconds(delta: number): number[] {
    var hours = Math.floor(delta / 60 / 60);
    var remainder = (delta - (hours * 60 * 60));
    return ([hours, ...this.calculateMinutesSeconds(remainder)]);
  }

  private calculateMinutesSeconds(delta: number): number[] {
    var minutes = Math.floor(delta / 60);
    var remainder = (delta - (minutes * 60));
    return ([minutes, ...this.calculateSeconds(remainder)]);
  }

  private calculateSeconds(delta: number): number[] {
    return ([delta]);
  }

  private calculateWeeksDaysHoursMinutesSeconds(delta: number): number[] {
    var weeks = Math.floor(delta / 60 / 60 / 24 / 7);
    var remainder = (delta - (weeks * 60 * 60 * 24 * 7));
    return ([weeks, ...this.calculateDaysHoursMinutesSeconds(remainder)]);
  }

  private format(values: number[]): string {
    var units: string[] = ["w", "d", "h", "m", "s"];
    var parts: string[] = [];
    var firstValue = false;
    for (var index in values.slice()) {
      if (values[index] || firstValue) {
        parts.push(values[index].toLocaleString() + units[index]);
        firstValue = true;
      }
    }

    if (parts.length === 0) {
      parts.push("0" + units[4]);
    }

    return (parts.join(" "));
  }

}
