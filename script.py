
import sys
import re



# Hàm xử lý lấy học phần song hành
def getCorequisite (courses) :
    result = []
    for course in courses:
        if course[-1] == "=" :
            result.append(course.replace("=",""))
    return result

# Hàm xử lý lấy học phần tiên quyết 
def getprerequite (courses) :
    result = []
    for course in courses:
        if course[-1:] == "!" :
            result.append(course.replace("!",""))
    return result


# -------------------- Main process ----------------------------

preModule = sys.argv[1]

RecommendLst=  re.split(',(?![^\(\[]*[\]\)])',preModule.strip())


priorityLst = []
for courses in RecommendLst:
    if "(" in courses or ")" in courses :
        continue
    else:
        priorityLst.append(courses.strip())
        
preCourseLst = []
prerequiteLst = getprerequite(priorityLst)
corequisiteLst = getCorequisite(priorityLst)
priorityLst = [course.replace("!", "").replace("=","") for course in priorityLst]
for course in priorityLst:
    if (course not in prerequiteLst) and (course not in corequisiteLst):
        preCourseLst.append(course)


data = {
        "preCourseLst" : preCourseLst,
        "prerequite": prerequiteLst,
        "corequisite": corequisiteLst
}  

print(data)
sys.stdout.flush();



    

    
