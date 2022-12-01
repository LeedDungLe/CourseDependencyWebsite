import math
import os
import graphviz
from var import *
from sympy.logic.boolalg import to_dnf
from os.path import exists

import sys

count = 0

# lay thong tin cua mon hoc
def getInfoModule( moduleCode):
    """_summary_
        Tính toán giá trị học phí nhỏ nhất để có thể đăng ký 1 học phần 
    Args:
        moduleCode (string): mã học phần đang xét
    Returns:
        Object {
              Hp (string): mã học phần, 
              Dep (string): chuỗi học phần điều kiện,
              FeeVal (float): tín chỉ học phí
              }
    """     
    result = {}
    for course in standardizedCourses:
        if course["HP"] == moduleCode :
            result = course.copy()
            break    
    return result


def findCheapest( moduleCode, count,):
    """_summary_
        Lấy các thông tin của học phần
    Args:
        moduleCode (string): mã học phần đang xét
    Returns:
        listHP: các học phần diều kiện tối ưu học phí nhất
        minVal: Tổng học phí khi học các học phần trên  
    """
    breakout = False
    count = count + 1
    if count >= 970:
        return "stop"
    listHP =[]
    minVal = 999
    
    moduleObj = getInfoModule(moduleCode)
    if len(moduleObj["Dep"]) == 0 :
        return {
            "listHP" : [],
            "minVal" : 0
        }
    else :
        optionModuleLst = convertToListOption(moduleObj)  
        # Duyệt từng cụm các HP recommend  
        for CourseLst in optionModuleLst:
            SumVal = math.fsum(x["FeeVal"] for x in CourseLst) # Tổng học phí phải bao gồm tổng các HP bên trong cụm
            tempList = []
            tempList.append({
                "parent": moduleCode,
                "lineTree": [item["HP"] for item in CourseLst.copy()]  # list các HP phải bao gồm các HP đang xét trong cụm hiện tại 
            })            
            # Duyệt từng học phần bên trong cụm các HP recommend
            for course in CourseLst:
                currentCourse = findCheapest(course["HP"],count)
                if currentCourse == "stop" :
                    breakout = True
                    break
                tempList.extend(currentCourse["listHP"])
                SumVal = SumVal + currentCourse["minVal"]
            if breakout == True:
                break    
            if SumVal <= minVal:
                minVal = SumVal
                listHP = tempList.copy()
    if breakout == True :
        return "stop"

    return {
            "listHP" : listHP,
            "minVal" : minVal
        }

def convertToListOption(moduleObj):
    """_summary_
        lấy thông tin các cụm hp có thể cùng học
    Args:
        moduleObj (object):  học phần đang xét
    Returns:
        result(list) Object[] {
              Hp (string): mã học phần, 
              Dep (string): chuỗi học phần điều kiện,
              FeeVal (float): tín chỉ học phí,
              optimizeLst (list): dãy học phần tối ưu
              }
    """
    result = []    
    if moduleObj["Dep"] == "":
        return result
    else:
        dnf_result = to_dnf( moduleObj["Dep"])
        OptCodeLst = str(dnf_result).split("|")
        for moduleCode in OptCodeLst:
            itemlst = []
            moduleCode = moduleCode.replace("(", "").replace(")", "")
            courseLst = str(moduleCode).split("&")
            for i in courseLst:
                item = getInfoModule(i.strip())
                itemlst.append(item)
            result.append(itemlst)
        return result

#----------------------------------------------------------------
#Run main

mainModuleCode = sys.argv[1]
COURSE_COLLECTION_FOLDER = os.getcwd() 

filePath = "/pic/"+ mainModuleCode + ".png"

is_file_exists = exists(COURSE_COLLECTION_FOLDER + "/public/" + filePath)


if(is_file_exists) :
    print(filePath)
else: 

    cheapestLst = findCheapest( mainModuleCode,count)

    if cheapestLst == "stop":
        print("stop")
    else :
        dot = graphviz.Digraph('G', 
                                node_attr={'shape': 'record',}, 
                                edge_attr={'len': '2.0'}
                                )
        dot.attr('node', shape='house', color='red:orange', style='filled', gradientangle='270', fontcolor='white')
        listHP = cheapestLst["listHP"].copy()

        for item in listHP:
            for i in item["lineTree"]:
                dot.edge(item["parent"],i)
            
        dot.render(COURSE_COLLECTION_FOLDER + "/public/pic/" + mainModuleCode, view=False,cleanup=True,format='png')
        dot.clear()
        
        print(filePath)

sys.stdout.flush();