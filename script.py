from sympy.logic.boolalg import to_dnf
import sys

def syntaxStandardized (preModule):
    preModule = preModule.replace("*", "").replace("=", "_").replace(" ", "").replace("!", "__")
    result = preModule.replace(",","&").replace("/","|")
    return result

# Hàm xử lý lấy học phần song hành
def getCorequisite (courses) :
    result = []
    for course in courses:
        if course[-1] == "_" and course[-2] != "_":
            result.append(course.replace("_",""))
    return result

# Hàm xử lý lấy học phần tiên quyết 
def getprerequite (courses) :
    result = []
    for course in courses:
        if course[-2:] == "__" :
            result.append(course.replace("__",""))
    return result

# Hàm xử lý lấy học phần ưu tiên
def getPriority (coursesLst):
    coursesLst = [courses.replace("(","").replace(")","").replace(" ","").split("&") for courses in coursesLst]    
    result = coursesLst[0].copy()
    for item in coursesLst[0]:
        is_continue = True 
        for course in coursesLst: 
            if item not in course:
                result.remove(item)
                is_continue = False
                break
            if is_continue == False :
                break    
    return result


# -------------------- Main process ----------------------------

preModule = sys.argv[1]
# preModule = 'CH1010,CH3002=, CH3122=, CH3223='


# Thay đổi các ký tự cú pháp sang biểu thức logic
standardPreModule = syntaxStandardized(preModule)
# Biến đổi biểu thức logic sang dạng chuẩn dnf
dnf_result = to_dnf(standardPreModule)
#Phân ra list các cum môn học recommend
RecommendLst= str(dnf_result).split("|")




data1 = [] # lưu mảng các cụm học phần recommend
data2 = [] # luu các học phần yêu cầu phải có 

# Xử lý để đưa ra các cụm học phần có thể học
for courses in RecommendLst: 
    coursesLst = courses.replace("(","").replace(")","").replace(" ","").split("&")
    prerequiteLst = getprerequite(coursesLst)
    corequisiteLst = getCorequisite(coursesLst)
    standardcourseLst = [course.replace("_", "").replace("__","") for course in coursesLst]
    # print("các môn cần học: ", standardcourseLst)
    # print("Học phần tiên quyết: ", prerequiteLst)
    # print("Học phần song hành: ", corequisiteLst)
    # print("----------------------------------")
    item = {
        "courses": standardcourseLst,
        "prerequite": prerequiteLst,
        "corequisite": corequisiteLst
    }
    data1.append(item)

# Xử lý để đưa ra các cụm học phần bắt buộc có 
priorityLst = getPriority(RecommendLst)
prerequiteLst = getprerequite(priorityLst)
corequisiteLst = getCorequisite(priorityLst)
priorityLst = [course.replace("_", "").replace("__","") for course in priorityLst]
preCourseLst = []
for course in priorityLst:
    if (course not in prerequiteLst) and (course not in corequisiteLst):
        preCourseLst.append(course)

# print(preCourseLst)
# print(prerequiteLst)
# print(corequisiteLst)

data2 = {
        "preCourseLst": preCourseLst,
        "prerequite": prerequiteLst,
        "corequisite": corequisiteLst
}   

data = {
    "rcmLst": data1,
    "require": data2
}

print(data)
sys.stdout.flush();



    

    
