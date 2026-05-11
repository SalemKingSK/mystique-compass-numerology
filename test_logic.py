def reduceNum(n, allowMaster=True):
    if n == 0: return 0
    val = abs(n)
    while val > 9:
        if allowMaster and (val == 11 or val == 22 or val == 33): return val
        val = sum(int(d) for d in str(val))
    return val or 9

def calc(m, d, y):
    redM = reduceNum(m, True)
    redD = reduceNum(d, True)
    redY = reduceNum(y, True)
    
    p1 = reduceNum(redM + redD, True)
    p2 = reduceNum(redD + redY, True)
    p3 = reduceNum(p1 + p2, True)
    p4 = reduceNum(redM + redY, True)
    
    c1 = reduceNum(abs(redM - redD), False)
    c2 = reduceNum(abs(redD - redY), False)
    c3 = reduceNum(abs(c1 - c2), False)
    c4 = reduceNum(abs(redM - redY), False)
    
    return {
        'red': (redM, redD, redY),
        'p': (p1, p2, p3, p4),
        'c': (c1, c2, c3, c4)
    }

print(calc(10, 24, 2002))
