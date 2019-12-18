
import { StyleAlias } from './var';

const InitialVars = {
  chrome: {
    textColor: '#FFF',
    altTextColor: '#EBEBEB',
    backgroundColor: '#28292D',
    target: '#1CA6FC',
    lightTarget: '#99C3FB',
    alternate: '#FF9800',
  },
  footer: {
    textColor: '#CCC',
    activeTextColor: '#FFF',
    backgroundColor: '#005FAF',
    activeBackgroundColor: '#1C82C6',
    alternateBackgroundColor: '#005FAF',
    borderColor: '#555',
    activeBorderColor: '#FFF',
    dividerColor: '#FFF',
    error: '#F44336',
    warning: '#FFEB3B',
  },
  toolbar: {
    color: '#C2C2C2',
    activeColor: new StyleAlias('chrome.target'),
    hoverColor: new StyleAlias('chrome.target'),
    altColor: new StyleAlias('chrome.alternate'),
  },
  rulers: {
    size: 15,
    backgroundColor: new StyleAlias('chrome.backgroundColor'),
    textColor: new StyleAlias('chrome.textColor'),
    lineColor: new StyleAlias('chrome.textColor'),
    markerColor: new StyleAlias('chrome.target'),
  },
  catalog: {
    backgroundColor: '#fff',
    borderColor: '#eee',
    textColor: '#000',

    item: {
      backgroundColor: '#f7f7f9',
      backgroundHover: new StyleAlias('chrome.target'),
      textColor: new StyleAlias('catalog.textColor'),
      borderColor: '#e1e1e8',
      imageBorder: '#e6e6e6',
      imageBackground: '#fff',
    },

    tag: {
      backgroundColor: '#337ab7',
      textColor: '#fff',
    }
  },
  group: {
    select: new StyleAlias('chrome.alternate'),
  },
  sidebar: {
    backgroundColor: new StyleAlias('chrome.backgroundColor'),
    textColor: new StyleAlias('chrome.textColor'),
    targetColor: new StyleAlias('chrome.target'),
    borderColor: 'transparent',

    panel: {
      borderTopColor: '#222',
      borderBottomColor: '#48494E',
      textColor: '#FFF',
      hoverColor: new StyleAlias('chrome.target'),
      headerColor: '#303136',
      backgroundColor: '#2E2F33',
    },

    property: {
      row: {
        minHeight: '30px',
        display: 'flex',
        flexDirection: 'row',
        marginBottom: '2px',
        alignItems: 'center',
      },
      label: {
        flexGrow: 0,
        flexShrink: 0,
        width: '6em',
        textTransform:'capitalize',
      },
      subLabel: {
        width: 'auto',
        minWidth: '5em',
        maxWidth: '8em',
        padding: '0 1em',
        flexGrow: 1,
        flexShrink: 0,
        textTransform:'capitalize',
        whiteSpace: 'nowrap',
        textAlign: 'right',
      },
      mainInput: {
        flexGrow: 1,
        flexShrink: 1,
      },
      subInput: {
        width: '5em',
        marginLeft: '2px',
        flexGrow: 0,
        flexShrink: 0,
      }
    }
  },
  grid: {
    backgroundColor: '#fff',
    target: new StyleAlias('chrome.target'),
    itemColor: '#84e1ce',

    mesh: {
      backgroundColor: '#F5F4F4',
      target: '#99C3FB',
    },

    item: {
      border: '#8E9BA2',
      targetBorder: new StyleAlias('chrome.target'),

      fill: '#84E1CE',
      targetFill: new StyleAlias('chrome.lightTarget'),

      text: '#000',
    },

    lines: [
      '#ddd',
      '#808080',
    ],

    ruler: {
      color: new StyleAlias('grid.target'),
      textColor: 'rgba(0,0,0,0.5)',
    },

    guide: {
      color: new StyleAlias('grid.target'),
    },

    vertex: {
      fill: new StyleAlias('grid.target'),
      stroke: '#fff',
    },
  },

  cursors: {
    default: 'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAACbklEQVRYw+2WTYhSURTHfdkkVlMxfVNEUVEMDEGl0MJlguCmVQQpRNskRBy3bsWF6DJcuHiLoUVJCdJKEcwPBC1UBE0XblTIRT0/Fr73OudxhJnJJkefF4IO/OG+y3v3/M7H1aPRaDQc6CjoGEmrYWzo/BToEukMgTCz46Brg8GgXqvVeFhvgs6xhMDoN2WyUqn0AZ63WEJgyu+j89FopEAUi8WPLCEQ4CE6TiaTcjabZQ6xB8BgMDCH+A2ANcRMAJYQfwRgBXEgAAuIvwKsGmIugFVCzA2wKohDARiNRtUh5gZA51PNgDgLWmMGsBuiUqm8gzNugE7QfKE+QKfTEeUDLJfLbdM/6xFVAFwulxyLxWSTyaRE2263pclkIsbj8U+JROJ9Op1+m8lkdgqFAl8ul9/4/f5HcM5JVTLgdrtlQRCUiMPhsALA87wSqdfr9cH7JhpcboKugy6DTi/aiHsAps5BA5DQarUkBDCbzfJwOBQbjUYB3n8AukDTlG7XLMktBVCtVhXn4Eiw2WzbkO4o7iMUQqRSKVmSJNFutz+Bby7SPLm0YeruTZsJpqKfTqfzBewZLRbLUxEMaq0AOBwOBJDy+fwOdb1ODQBsnNsY2Xg8/uHxeJ7T4VjXrXq9/hn2RavVqkA0m00JBtjv+A2VYGnDKM7DnX7t8/kew/oqQelBV0Kh0CvMDKY/Go3K4Fzs9XpfCVKvBoCWDsI7vE5rLd1n3LvT7Xa/TEvU7/e/BQKBZwi96C/fLOPIIbevk9HBhk6nuxWJRF4Gg0EbPN+lBtQv2vWHBVujkmyQ1unardz5fhBuRob+279vvwBaC6MkVJrDhAAAAABJRU5ErkJggg==) 7 5, default',
    pointer: 'pointer',
    grab: 'grab',
    drag: 'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAC7klEQVRYw9VXS4saQRCW7CanDeQQcsnJwP4B9ZyLgiDC/gZPYjaQk4e9KOp68HkURPCtJ/9A/oDoTfSooIL4OKgnR1TWTn9D9zBjxkdkdpkMFE3XdHV9XV311YzB8J8+N1TuqHyh8pWNd0z/Js4/UjFmMhmPIAhzjJgz/c1bOP+WTCZ/Uefrer1OMGIO/WuCkJzH43HReT6fJxaLheRyOREE9K8FQnIeiUR+wlmhUBCdc8EcerzXGoTkPBwOP1InQqlUUjjnUiwWAULQEsQtlU9U7kOhkOi8XC6rOueC91iH9bBj9rfXnlx0HggEkO2rarV60jmXSqUCECvYyUDcXBP2e6/X69lsNi/7/Z7sdjtRttst8fv9CqeYQ8/XYD3sYM9AXHwd0p3TEzxOJpPVYDAgbrf7yel0uqxW64/ZbDalZacAgDn0eI91Ho/naTgcEthjn0tzQpFwq9VKQGItFgtis9lcVP+din06nY7UAECP91hnt9tdy+VSTEzsg/3OgTgsNSnhEFqcjG3+cAbAA9ZhPa5CnpinquMvkpGXGr1LhHLa7/dHjUZjRE+2peEmCDEXzKFvNpsjemUjXAeA8z2w3zGyescaiZHT6yHJ+Hw+kkgkSDQaJcFgkLRaLVKr1X6nUqlYNpt9xog59LT8SCwWEyNymKicrBhtG5lfw3t0M9ZYJHqVi9lslsRkMpF2uw0wMWpnZhluxrzT6YhrTpUo9ocf1sDQRQ0f0FLR1dBY1IzkACDdbpek0+ln5vwzRsx7vd5FPMEa2Jy1cmUE0FhOGQMATnptBHjjkkfgbA7gLnGnuFvcsdY5oFoFqF9uiGxGViO7keXz+XxLS46AoCCXVAFrVCdb9lEeQD3LeWA8Ho9QFTwntOABVRBgMIQNjAZm40x4BoCCCWGPff6lRR/tBQ6HQ+wFICU1AFr0AtVuuF6vX+gj5gIEzAhykgPQshvq4ntAF19Euvgm1MVXsS7+C3TxZ6SLf0PN/47/AMJBg55UV9j9AAAAAElFTkSuQmCC) 15 15, move',
    ewResize: 'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAACPElEQVRYw+1Wu04CQRRVfBANPqIJFtpga2MCpSXxCzAUNjSQgCbWNmADCQnQUZHwho7f4CsslliwZDE0hmdgvGdz3QiCLEQNiXuTk83s7DnnzsydmV1bM8III1Y8TIRNwhY/13Xy1id4pmXMNwgWwjHBSjggbOvkbvP3VuZbWG8h8z2CLZlM3rbbbcXj8VyykJ6weL3ey263q4APHdbbWMT8PBKJ+DudzttwOBQ+n++a3h3pWAb0HwUCgevRaCTAhw709CShmYfD4TsaebtcLot+vy9cLtcNj2SfsMPra/pUK1v8Hv02t9t9MxgMBPjQgd68JDTzaDR6D1KxWBQOh0NNwOl0YhRXhAtOBGtrZnMzt23cf4XvkQD40IEedGcloZnHYrEH+rZTKBRUMtDr9US9XpcJL4qiSM1m8zmdTrvo+0MuuEO0W63WM/VJjUbjhSAj8Q8N6EEX+pNJmLi4bIlEQjXP5XIaEQgGgyIej2uQZVlUKpVH4pzwtJ+gTaaCNDSEQqExHehCHz48W2pRY+2sqVTKj85sNjtGAux2+xgkScKInoh3StjFE+1arfaFOwnowwd+vE3VKTyll6/VanUq6ZsEzjiBM70JAPCBHw9gfAYymcxcARgtOwPQn5yBuTWAtfy8tljrn6yBqbsgn89rRFQzqhrVjSpHtS+6C6A3axfMPQewn3/7HJiZRKlUUhPAybbMSQi+XvOZdwHOdJztf3EXTL0Ncavhdvur23Al/gdW4o/ICCP+R7wDteVvXm7aNHsAAAAASUVORK5CYII=) 15 15, ew-resize',
    nsResize: 'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAACLElEQVRYw9VXPWtiQRTNx2owuLvBwKZImmy7TUDLLSW/wGCxjY1C3IXUaXQbBUHtrAS/tfNv+CtSPLHwyXOxWZ5f6OSe4b7HCiaE6PjcgcMwd+7MOW/ezL0zBwf/aTkmeAlfCJdce9m+E/KPhOtisXhvmuYf1Giz/XgX5F/z+fwDkY87nY5AjTbsKkXY5NlsVpJXKhURCAREuVyWImBXJcImz2Qyv0BWrVYluQW0YUf/tkXY5KlU6ieRmPV6fYXcQq1WgwhzmyKOeHdfp9NpbDiz0WisJbeAfvjBnzeml+d5V/lAOC8UCj/G4/HfVqv1KrmFZrMp4I9xGM/zvKu4cMYnk4mxXC7FfD6XmM1mIplMrpCiDbvlA3+M4xjh2mQFPkej0Zt4PH4bDofvgsHg/WAw0OnYrQhAG3b0ww/+GIfxm6zAIcHN/9HH//Q7EfVeENBDP/v5eJyb59m4YJJPhG/D4VBbJwB29LPfoYpg5MHXjUajJ/pa0e12baANO3+9R1UoxmY6L5VKoXa7/Ujx4LcFtGHnXe9SJQDn+YRwRrjgTHjF9QXbTzY5928V4eZlPv0HHrYrJ3d0BRzfA/IU0HF70nVdaJomsatTYMcBwzC0XC4n/H6/hMo4sDYS9vv93joBKiKhzAWRSOQmFovdhkIhmQtIgP6CgK3nApkNKb0bi8VCZjtgOp2KRCKxIkBlNnT0PuD4jcjxO+Fe3Ir34l2wFy+jvXgbbv11/Axrtm9KQOSfnQAAAABJRU5ErkJggg==) 15 15, ns-resize',
    rotate: 'url(data:image/png;base64,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) 15 15, move',
    crosshair: 'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAA4klEQVRYw+1XwQrCMAwdFFQo7rgOepKd3EDwsB/25CfttF+ZefAKo1CZIq1KHjweyUqShTbrqkrxHoxwJzxQTe7kVuiEnmpzFrEXtvM83xYBFDb9WYC37ZB8HEfIApv+LDgK+6iAnv4sqIVDVMBAvxbwH3vA8EhZBq1XhN0kOtAk1lvGM68MmZZHq2fwwGBfp2m6IzkUdvR8vb5jvE3DCmPVhSGTApNehGdoKCYFDivH+E+B2e5De1Nk25H8BN243jP+d3eg+B4ofgr0W6AF/MQeKH4jKn4nLH4rLv5foFB8FA9r23DV3h9YPQAAAABJRU5ErkJggg==) 15 15, crosshair',
    crosshairAdd: 'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABUUlEQVRYw+1XwWrCQBAVAlqIejQJOZQqHozQ0kNuPfUnrB/QT+gP9eQn5ZRfifPgrciy027quhbJg8e44zLznMxO1tFowN+QCMfCB9okdvJUmAlL2jSmiIkwb9v2uxPAYk1/FODXrpC8rmuYDmv6o2AmrCwBFf1RMBduLQFb+gcB99EDCY9UyqDzM2K9UCqwUPanjJf0GTI5j1bF4IZm/do0zQHJYbG2vj/fv2I8r2GFsZqZIaOBSZ+FG1gjRgOHVcb4PwKzvTTl1ciyI/kTrOf+kvH/dwVu3gNBToFdAfE9hnxb/joH6Ov4EfZdWESbhA4Be+H6qgIcZT8JsPzF1QSYpBpDPQ5nD/QQ8CFcBr8R9XgEFwvQ7oQvLO/e0YRfwk8248WPQLsVTylk7RCA5G88CUWoV7b6v8BR9qDH0Ac5S70jgw4iX2RstuUtkg/wxhEabyP02L/adwAAAABJRU5ErkJggg==) 15 15, crosshair',
    vertex: 'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAA40lEQVRYw+3Xuw3DIBCAYTZJlSoFWJwlCgZJYTGAt4iUdKkyADPQeo6sQTZwTBpbQlbiV+Cu8UlX/59oAMb26Ucp9ZRS3skAABD6fZABqqqiQwBAaJomOOdoEAOg6zoaRAwgQYwB6IhvAFTELwAaYgqAgpgDZEcsAWRFLAVkQ6wBZEGsBSRHbAEkRWwFJEP8A0iCmAJ470Nd1230aJlbkwzgvQ/GmFZr/QKAGwBcp1ZKeSmK4pAEEMc55yfUywg1Pgagx2MASXwAWGtp4vG/gCTOGGNlWb7J4v0JnIUQx/2Tij0fs9AFdsbMbpoAAAAASUVORK5CYII=) 7 5, default',
    move: 'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABqUlEQVRYw73XXUvCUBgH8LPeLXujgoKIXvBGiCJS6AP0LaJuul5MMD/D2Dfo2ovqoqC+gDeiwmC7mCL0IYSamzduPUceYbNpTrfnwB8mjv1/G2eHM8YYEyBzkAXMLCMevHwNsovZQAjZWIYctNvtr2azWYTjNGSbEsHvPu3i0HX9A36fUiL4I7/g5bZt9xCapn1SIjjgkheXSiW3Wq2SI3yATCZDjvgDoEYEAigRQwFUiJEACsS/gLgRYwHiRIwNiAsRChAHIjQgasREgCgREwGy2WwvUSBCA/rlIxBbkPlYAIPlg4h6vf4G1zuCrOB2b3pAPp93W61W1x1z1Gq1R9zozEwN4OWmaXYtyzLh//dyufxaqVReAvKsqmrRMIwnRVGu4JrJqZ+Ap/xHFMV7OO8ckoKcDMkhZA+yHmYiBgK85ZIk3cE5x5BN3MQmArIEWfRs7YWJAd7yXC53i3eWjOubwQegLvcBGo0GeTnDCXPWf4Vga05azrAk5ThOt9PpfBcKhRvKcoYzdwdWsgdZlq/heJ+ynGFRAleuVTwm/0IWcNkUwry/UYxfEvbd6Lx3KpsAAAAASUVORK5CYII=) 7 5, move',
    moveVertex: 'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAB9UlEQVRYw72XyU7CUBSGWxEHnBMJxhirJJKAcUALW1cs9BmMblxjICE8A8+BK12QOKwhIQR2sCIkbngDEi3DBuo55DSpgtzbQu9JvlDaS/+vtz2llSRJkoF5YIFwSYILw9eBHWKTRISVB9hvt9ufjUbjCZZDwLZICTz6kE5Vq9Ve4fuJSAmc8gsM73a7Q4lqtfomUgIFVAwuFAp6pVIRLvFLIBKJCJcYERAtMVZApMS/AqIkJgqIkGAKOC3BJeCkBLeAUxKWBJyQsCwwawlbAobEYDAwJE4BL7AoRCAajQ4/i8Wi3uv19HK5/AH7uQR2gRVgzjEBDFdVVZ9UsM8NXglLAsaRh8NhI2gEWn/Ie00wBVKplN5qtfo4Bs85Tnmz2WQJHAPL9MxpXwDDNU3rdzodDbbnSqXScz6ff8lms+8cAktTCZjCv+Px+AOMOwcCQBC4YggEqCPsCZjDE4nEPYzxA1t0heNvggwBv20Bc3gymbyD7QfAKr0zyLRjhdEFii0BRrhRbsBHfR8DroEb+ozReh+N4++Cer3OEy5Rf3soRKGWM1BovYf3PoA3jDNj6uDRnBVulnDTNP/FbeVOiCFH0N996O+vdDp9yxFuLnkMlgqNvfDH8pjJZPD87VkIn0m56I6Fr2hrtCz8DVmmc2ZrCqepH+j2DKZZWZ0yAAAAAElFTkSuQmCC) 7 5, move',
    moveAdd: 'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABwUlEQVRYw72XzUoCURiGx4rC6BeKDCLCcJEQZaSrVkJBV1BC5KZaGgoy1+B9tKlNUDfgZtCdrkToIoQafzZq75FvYrQZ9Zua74MHj8xw3mfOOTOco2maFgBzYJ6Y1YRLha+AELFGImK1CHabzeZHvV5/QjsKNiQl1NNH+1TVavUN/w8lJdSQn6jwdrs9kKhUKu+SEkrgVAUXi8V+uVwWlxgSiMfj4hK/BKQlHAUkJVwFpCTGCkhITBTwW2IqAT8lphbwS4Il4IcEW+C/JTwJ2CVGC/1t+y6QSCQGWBLoYwC1LzgSbAEr3MJB4B4c+CJgDx0Z9h8B7nRMFMjn8/1Go9F1C3WD7klOkhgroMJN0+y2Wi0T118Nw3gplUrPDIFrEPYkYAv/ymQyd7jvGETAPmMKvAnYw7PZbJo6WadNbBDEwCVIOyxCHTyAlKcpsIfncrlbXN8DSyNnhiBt4yMub8EZjRZvEU4ZPlQOw56icN5rWKvV2OFUIRrqKyLJ+RCtgiPLHltzbrhVW7ROwtxPsQqJ9Hq9bqfT+dR1/cZD+J9qAWzim/5YKBTO0d6RDNcoKEhHtGVqi5+Q1RF9hn4DksHfV+Uz8fdB+ZwAAAAASUVORK5CYII=) 7 5, copy',
    anchor: 'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAB+UlEQVRYw8XXP0hCQRwH8Kfln6IhcsgUAkMJgiCatCGopdrKzVZREdwbmmqIRpdWCURBXYJKfEkvFA0VtVKIsOmBi6NU1Fa/i59DPtT3rLsefLl7B3qfO8/37jiO41SQ0Var5YBSA1FzjK8RyES73T4tFovrUNezRpBRTzebzQQAztLp9Abcj7FE6CCzjUbj3Gw2v+Tz+YtkMrnFEkEAc/V6nYfyExCvuVzukiWCAKzVavWaAP4DQQC2SqUidACIeGOFkACg8w+WMyEBhMPhZ5YICYDn+Xo0Gn1khZAABEGouFyuk1gsVmOBkADgWXAL5a7b7T6Kx+MP0Pk7TYQEUCqVMlCuQta8Xu8hIO5pIiSAcrl8A+UixAJZ8fl8BzQREgDW5yGTEDPEQRPRC2DDLyYx0UT0A+jxdU0V0Q+gww2LmiZCDoCjiZALoIZQApCNSKVSm7iGVH8NGIjw+/1PoigmQqHQAtnwDkIMA+iFuPN4PCLsLbORSGQP2mcgWlqAboQ9EAjsFwqFTDAYPIb7ZYiB5gx0I8hol5xO5w52bpK7EH8L6CDIgptCiIHmv6DXpcLp1mKp6DnwY1eMdatCQAehUviZ704stVrtKpvNFklIHV/FSgFDH82MZBVDtjF2bNOwOBmR32ocO7RgjNjG7HyoxtHqMMyO6V8gJtsShHTWqgAAAABJRU5ErkJggg==) 7 5, default'
  }
};

export default InitialVars;
