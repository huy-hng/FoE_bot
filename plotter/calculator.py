import csv
import os
import math

os.chdir('./FoE_bot/plotter')

lvls = []
with open('arc_data.csv') as csvf:
    content = csv.reader(csvf)
    skip_once = True
    for row in content:
        if skip_once:
            skip_once = False
            continue
        lvls.append(row)

i_lvl = 0
i_fp = 1
i_p1 = 2
i_p2 = 3
i_p3 = 4
i_p4 = 5
i_p5 = 6


def calc(total, fp_list):
    
    total = int(total)

    save_cum = 0
    save_list = []
    for fp in fp_list:


        # if fp < 100:
        #     fp = math.ceil(fp * 1.8)

        # elif fp * 1.9 < 1000:
        #     fp = math.ceil(fp * 1.9 - 10)
        # else:
        #     fp = math.ceil(fp * 1.9 - 20)

        fp = math.ceil(fp * 1.9)

        save = save_cum + int(total - fp * 2)

        save_cum += save
        total += (-save - fp)

        if save < 0:
            save = 0
        save_list.append(save)

    return save_list

def main():
    for i, row in enumerate(lvls):
        total = float(row[i_fp])

        p1 = float(row[i_p1])
        p2 = float(row[i_p2])
        p3 = float(row[i_p3])
        p4 = float(row[i_p4])
        p5 = float(row[i_p5])
        fp_list = [p1, p2, p3, p4, p5]

        save_list = calc(total, fp_list)

        
        print(row[i_lvl], row[i_fp], save_list)
        print(row[i_lvl], f'Greg P1({math.ceil(p1 * 1.9)}), P2({math.ceil(p2 * 1.9)}), P3({math.ceil(p3 * 1.9)}), P4({math.ceil(p4 * 1.9)}), P5({math.ceil(p5 * 1.9)})')



main()

def test():
    total = 1670
    p1 = 865
    p2 = 437
    p3 = 135
    p4 = 36
    p5 = 9

    fp_list = [p1, p2, p3, p4, p5]

    save_cum = 0
    save_list = []
    for p in fp_list:

        save = save_cum + int(total - p * 2)
        print(save)
        save_cum += save


        total += (-save - p)

        if save < 0:
            save = 0

        save_list.append(save)



    print(save_list)

# test()