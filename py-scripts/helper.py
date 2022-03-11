from googlesearch import search

def getURLs(query):
    links = []
    for link in search(query, tld="co.in", num=10, stop=10, pause=2):
        links.append(link)
    return links
