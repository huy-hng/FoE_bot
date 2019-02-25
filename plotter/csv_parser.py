import csv
import os

os.chdir('./FoE_bot/plotter')


lvl_index = 0
p1_index = 1
p2_index = 4
p3_index = 7
p4_index = 10
p5_index = 13

needed_fp_index = 1

data1 = ['Level','P1_fp','P1_meds','P1_bp','P2_fp','P2_meds','P2_bp','P3_fp','P3_meds','P3_bp','P4_fp','P4_meds','P4_bp','P5_fp','P5_meds','P5_bp']
data2 = ['Level','Benötigte Forgepunkte','Kumulierte Forgepunkte','Gildengüter','Mäzen Bonus']

needed_fp = []
p1 = []
p2 = []
p3 = []
p4 = []
p5 = []

with open('arc_data1.csv') as csvf:
    content = csv.reader(csvf)

    for row in content:
        # print(row)
        p1.append(row[p1_index])
        p2.append(row[p2_index])
        p3.append(row[p3_index])
        p4.append(row[p4_index])
        p5.append(row[p5_index])

with open('arc_data2.csv') as csvf:
    content = csv.reader(csvf)

    for row in content:
        needed_fp.append(row[needed_fp_index])

print(needed_fp)

lvl_list = 'Level,Benoetigte Forgepunkte,P1_fp,P2_fp,P3_fp,P4_fp,P5_fp\n'
for i in range(len(needed_fp)):
    level = i + 1

    lvl_list += f'{level},{needed_fp[i]},{p1[i]},{p2[i]},{p3[i]},{p4[i]},{p5[i]}\n'

print(lvl_list)
with open('arc_data.csv', 'w') as csvf:
    csvf.write(lvl_list)