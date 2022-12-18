import sys
from datetime import datetime, timedelta
import copy


startDate = sys.argv[1]
endDate = sys.argv[2]

# data = [
#   {
#     "date": "2022-12-02",
#     "count": 11,
#   },
#   {
#     "date": "2022-12-03",
#     "count": 14,
#   },
#   {
#     "date": "2022-12-04",
#     "count": 4,
#   },
#   {
#     "date": "2022-12-07",
#     "count": 7,
#   },
# ]

data =sys.argv[3]


# delta = timedelta(days=1)
# startDateObj = datetime.strptime(startDate, '%Y-%m-%d')
# endDateObj = datetime.strptime(endDate, '%Y-%m-%d')


# result = []

# dataDateObj = copy.deepcopy(data)


# for item in dataDateObj: 
#     item["date"] = datetime.strptime(item["date"], '%Y-%m-%d')


# dateArr = [item["date"]for item in dataDateObj ]


# currentDateObj = startDateObj
# while (currentDateObj <= endDateObj):
#     if (currentDateObj not in dateArr):
#         result.append ({
#             "date": currentDateObj.strftime('%Y-%m-%d'),
#             "count": 0
#         })
#     else:
#         for item in dataDateObj:
#             if(item["date"] == currentDateObj):
#                 result.append({
#                     "date": currentDateObj.strftime('%Y-%m-%d'),
#                     "count": item["count"]
#                 })              
#     currentDateObj += delta
 

print(data)


sys.stdout.flush();