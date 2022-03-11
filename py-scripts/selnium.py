from googlesearch import search
from bs4 import BeautifulSoup
import requests

####-------------------------search engine function + web scrapping-----------------------------###
def get_result(search_term):
    #scraping search engine
    links=[]
    for i in search(search_term,tld="co.in",num=5,lang='en',start=2,stop=10,pause=2):
        links.append(i)
    n = len(links)
    
    #finding headings 
    titles=[]
    for j in range(n):
        request = requests.get(links[j]).text
        soup = BeautifulSoup(request,'lxml')
        heading = soup.find('title')
        hs = heading.text
        titles.append(hs)
    
    #finding meta description
    for k in range(n):
        r = requests.get(links[k]).text
        soup = BeautifulSoup(r,'lxml')
        meta_tag = soup.find('meta', attrs={'name': 'description'})
        if meta_tag:
            print(titles[k])
            print(links[k])
            print(meta_tag['content']+'\n\n\n')
    print('\n\n')
    for i in range(n):
        print(links[i])
    


get_result("python")