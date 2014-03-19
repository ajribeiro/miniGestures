def recfib(n):
	if n == 0 or n == 1:
		return 1
	else: return recfib(n-1)+recfib(n-2)



for i in range(20):
	print recfib(i)
