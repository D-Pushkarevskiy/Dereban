import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AreasService {
  public areas: string[] = [
    '',
    'АР Крым',
    'Винницкая область',
    'Волынская область',
    'Днепропетровская область',
    'Донецкая область',
    'Житомирская область',
    'Закарпатская область',
    'Запорожская область',
    'Ивано-Франковская область',
    'Киевская область',
    'Кировоградская область',
    'Луганская область',
    'Львовская область',
    'Николаевская область',
    'Одесская область',
    'Полтавская область',
    'Ровенская область',
    'Сумская область',
    'Тернопольская область',
    'Харьковская область',
    'Херсонская область',
    'Хмельницкая область',
    'Черкасская область',
    'Черниговская область',
    'Черновицкая область'
  ];
  public multDimAreasArr = [
    ['Волынская область', 'Ровенская область', 'Житомирская область', 'Киевская область', 'Черниговская область', 'Сумская область', '', ''],
    ['Львовская область', 'Тернопольская область', 'Хмельницкая область', 'Винницкая область', 'Черкасская область', 'Полтавская область', 'Харьковская область', 'Луганская область'],
    ['Закарпатская область', 'Ивано-Франковская область', 'Черновицкая область', 'Кировоградская область', 'Днепропетровская область', 'Донецкая область', '', ''],
    ['', '', '', 'Одесская область', 'Николаевская область', 'Херсонская область', 'Запорожская область', ''],
    ['', '', '', '', 'АР Крым', '', '', '']
  ];

  constructor() { }

  public getAreas() {
    return this.areas;
  }

  public getNearbyAreas(area) {
    var currAreaInd = this.getIndexOfArea(area);
    var yInd;
    var xInd;
    var nearbyAreasArr = [];
    var result = [];
    if (!currAreaInd) {
      return area;
    }
    yInd = currAreaInd[0];
    xInd = currAreaInd[1];

    nearbyAreasArr.push([yInd - 1, xInd]);
    nearbyAreasArr.push([yInd, xInd + 1]);
    nearbyAreasArr.push([yInd + 1, xInd]);
    nearbyAreasArr.push([yInd, xInd - 1]);
    nearbyAreasArr.push([yInd - 1, xInd - 1]);
    nearbyAreasArr.push([yInd - 1, xInd + 1]);
    nearbyAreasArr.push([yInd + 1, xInd - 1]);
    nearbyAreasArr.push([yInd + 1, xInd + 1]);

    for (var i = 0; i < nearbyAreasArr.length; i++) {
      if (nearbyAreasArr[i][0] > -1 && (nearbyAreasArr[i][0] < this.multDimAreasArr.length)) {
        for (var j = 0; j < nearbyAreasArr[i].length; j++) {
          if (nearbyAreasArr[i][1] > -1 && (nearbyAreasArr[i][1] < this.multDimAreasArr[j].length)) {
            if (this.multDimAreasArr[nearbyAreasArr[i][0]][nearbyAreasArr[i][1]]) {
              result.push(this.multDimAreasArr[nearbyAreasArr[i][0]][nearbyAreasArr[i][1]]);
            }
          }
        }
      }
    }

    result = result.filter((areas, index) => {
      return index === result.findIndex(obj => {
        return JSON.stringify(obj) === JSON.stringify(areas);
      });
    });

    return result.length ? result : area;
  }

  public getIndexOfArea(area) {
    for (var i = 0; i < this.multDimAreasArr.length; i++) {
      var j = this.multDimAreasArr[i].indexOf(area);
      if (j >= 0) {
        return [i, j];
      };
    };

    return null;
  }
}
