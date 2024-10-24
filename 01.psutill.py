import psutil

processes = []
for p in psutil.process_iter(['pid', 'name', 'cpu_percent', 'memory_percent']):
    processes.append(p.info)

# print(len(processes))
# print(processes)

processes = sorted(processes, key=lambda x: (x['cpu_percent'], x['memory_percent']), reverse=True)
top_10_processes = processes[:10]

print(*top_10_processes, sep='\n')