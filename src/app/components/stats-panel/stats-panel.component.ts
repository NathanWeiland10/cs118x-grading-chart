import {Component} from '@angular/core';
import {Engine, OutMode} from 'tsparticles-engine';
import {GRADE_LIST} from '../../grades';
import {Chart} from 'chart.js';
import {loadSlim} from 'tsparticles-slim';

@Component({
  selector: 'app-stats-panel',
  templateUrl: './stats-panel.component.html',
  styleUrls: ['./stats-panel.component.scss']
})
export class StatsPanelComponent {
  graphTitle = 'Project #2 Grades';
  grades: number[] = GRADE_LIST;
  letterGrades: number[] = [0, 0, 0, 0, 0];
  sortedGrades: number[] = [];
  gradePortions: number[] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  gradeBreakpoints: number[] = [100, 95, 90, 85, 80, 75, 70, 65, 60, 55, 50, 45, 40, 35, 30, 25, 20, 15, 10, 5, 0];
  average: number = 0;
  color: string = '';
  median: number = 0;
  standardDeviation: number = 0;
  zeroes: number = 0;
  letterDistData: any;
  letterDistOptions: any;
  allGradesData: any;
  allGradesOptions: any;
  show: boolean = false;

  getLetterGrades() {
    for (const element of this.grades) {
      let grade = element;
      if (grade >= 90) {
        this.letterGrades[0] += 1;
      } else if (grade >= 80 && grade < 90) {
        this.letterGrades[1] += 1;
      } else if (grade >= 70 && grade < 80) {
        this.letterGrades[2] += 1;
      } else if (grade >= 60 && grade < 70) {
        this.letterGrades[3] += 1;
      } else {
        this.letterGrades[4] += 1;
      }
    }
  }

  getGradePortions() {
    for (const element of this.sortedGrades) {
      let grade = element;
      if (grade == 100) {
        this.gradePortions[0] += 1;
      } else {
        for (let j = 0; j < this.gradeBreakpoints.length; j++) {
          if (grade >= this.gradeBreakpoints[j] && grade < this.gradeBreakpoints[j - 1]) {
            this.gradePortions[j] += 1;
            break;
          }
        }
      }
    }
  }

  getAverageGrade() {
    for (const element of this.grades) {
      this.average += element;
    }
    this.average = (this.average / this.grades.length);
  }

  getMedianGrade() {
    this.sortedGrades = [...this.grades].sort((a, b) => (b - a));
    const mid = Math.floor(this.grades.length / 2);
    this.median = this.grades.length % 2 !== 0 ? this.sortedGrades[mid] : (this.sortedGrades[mid - 1] + this.sortedGrades[mid]) / 2;
  }

  getZeroes() {
    for (const element of this.grades) {
      if (element == 0) {
        this.zeroes += 1;
      }
    }
  }

  getLetterGrade(grade: number): string {
    let letter = 'F';
    if (grade >= 90) {
      letter = 'A';
    } else if (grade >= 80 && grade < 90) {
      letter = 'B';
    } else if (grade >= 70 && grade < 80) {
      letter = 'C';
    } else if (grade >= 60 && grade < 70) {
      letter = 'D';
    }
    return letter;
  }

  getAverageGradeColor() {
    if (this.average >= 90) {
      this.color = 'rgb(54,162,235)';
    } else if (this.average >= 80 && this.average < 90) {
      this.color = 'rgb(70,255,64)';
    } else if (this.average >= 70 && this.average < 80) {
      this.color = 'rgb(229,235,54)';
    } else if (this.average >= 60 && this.average < 70) {
      this.color = 'rgb(238,173,78)';
    } else {
      this.color = 'rgb(220,24,24)';
    }
  }

  getStandardDeviation() {
    let sqrSum = 0;
    for (const element of this.grades) {
      sqrSum += Math.pow((element - this.average), 2);
    }
    this.standardDeviation = Math.sqrt((sqrSum / (this.grades.length - 1)));
  }

  ngOnInit() {
    this.getAverageGrade();
    this.getMedianGrade();
    this.getZeroes();
    this.getLetterGrades();
    this.getGradePortions();
    this.getAverageGradeColor();
    this.getStandardDeviation();

    Chart.defaults.font.size = 20;

    this.letterDistData = {
      labels: ['A', 'B', 'C', 'D', 'F'],
      datasets: [
        {
          data: this.letterGrades,
          backgroundColor: ['rgba(54,162,235,0.2)', 'rgba(70,255,64,0.2)', 'rgba(229,235,54,0.2)', 'rgba(238,173,78,0.2)', 'rgba(220,24,24,0.2)'],
          borderColor: ['rgb(54,162,235)', 'rgb(70,255,64)', 'rgb(229,235,54)', 'rgb(238,173,78)', 'rgb(220,24,24)'],
          borderWidth: 3

        }
      ]
    };
    this.letterDistOptions = {
      plugins: {
        legend: {
          display: false,
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            font: {
              size: 24,
            },
            precision: 0,
            color: '#ebedef'
          },
          grid: {
            color: '#ebedef',
            drawBorder: true
          },
          title: {
            display: true,
            text: '# of Students'
          }
        },
        x: {
          ticks: {
            font: {
              size: 32,
            },
            precision: 0,
            color: '#ebedef'
          },
          grid: {
            color: '#ebedef',
            drawBorder: true
          }
        }
      }
    };

    this.allGradesData = {
      labels: ['100', '99 - 95', '94 - 90', '89 - 85', '84 - 80', '79 - 75', '74 - 70', '69 - 65', '64 - 60', '59 - 55', '54 - 50', '49 - 45', '44 - 40', '39 - 35', '34 - 30', '29 - 25', '24 - 20', '19 - 15', '14 - 10', '9- 5', '4 - 0'],
      datasets: [
        {
          data: this.gradePortions,
          backgroundColor: 'rgba(235,237,239,0.2)',
          borderColor: '#ebedef',
          fill: true,
          tension: .3,
          borderWidth: 3
        }
      ]
    };
    this.allGradesOptions = {
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            font: {
              size: 24,
            },
            precision: 0,
            color: '#ebedef'
          },
          grid: {
            color: '#ebedef',
            drawBorder: false
          },
          title: {
            display: true,
            text: '# of Students'
          }
        },
        x: {
          ticks: {
            font: {
              size: 18,
            },
            precision: 0,
            color: '#ebedef'
          },
          grid: {
            color: '#ebedef',
            drawBorder: true
          }
        }
      }
    };
  }

  showResults() {
    this.show = true;
  }

  particlesOptions = {
    fpsLimit: 120,
    particles: {
      color: {
        value: '#81c784',
      },
      links: {
        color: '#81c784',
        distance: 150,
        enable: true,
        opacity: 0.3,
        width: 1,
      },
      move: {
        enable: true,
        outModes: {
          default: OutMode.bounce,
        },
        random: false,
        speed: 5,
        straight: false,
      },
      number: {
        value: 100,
      },
      opacity: {
        value: 0.5,
      },
      shape: {
        type: 'circle',
      },
      size: {
        value: {min: 1, max: 5},
      },
    }
  };

  async particlesInit(engine: Engine): Promise<void> {
    await loadSlim(engine);
  }

}
