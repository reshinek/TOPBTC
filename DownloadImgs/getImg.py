import json
import os,urllib2,urllib
from multiprocessing import Queue 
import threading


path=r'C:\Users\i323766\Desktop\aaa\\'
url ='https://files.coinmarketcap.com/static/img/coins/'
f = open("data.json","r")

			
oJson = json.load(f)
f.close()
f = open("Error.txt", "a+")

def downLoadPicFromURL(dest_dir,URL):  
	try:
		urllib.urlretrieve(URL , dest_dir)  
		print 'SUCCEED  Downloading: ' + URL
	except:
		f.writelines(URL+'\n')
		print 'FAILED   Downloading: ' + URL

class download(threading.Thread): 
    def __init__(self,que):  
        threading.Thread.__init__(self)  
        self.que=que  
	
    def run(self):
        while True:  
            if not self.que.empty():   
                host=self.que.get()
                downLoadPicFromURL(host['path'],host['URL'])
            else:  
                break

que = Queue() 
threads = []
for aJson in oJson:
	filename = aJson['id'] + '.png'
	dest_dir = os.path.join(path+'16x16\\',filename)
	que.put({'path':dest_dir,'URL':url+'16x16/'+filename})
	dest_dir = os.path.join(path+'32x32\\',filename)
	que.put({'path':dest_dir,'URL':url+'32x32/'+filename})
	dest_dir = os.path.join(path+'64x64\\',filename)
	que.put({'path':dest_dir,'URL':url+'64x64/'+filename})
	dest_dir = os.path.join(path+'128x128\\',filename)
	que.put({'path':dest_dir,'URL':url+'128x128/'+filename})
	dest_dir = os.path.join(path+'200x200\\',filename)
	que.put({'path':dest_dir,'URL':url+'200x200/'+filename})

for i in range(20): 
	d=download(que) 
	threads.append(d)
	
for i in threads:
	i.start()
	
for i in threads:
	i.join()
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	