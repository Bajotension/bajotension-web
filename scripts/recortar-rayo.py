import cv2, numpy as np, sys
img = cv2.imread(sys.argv[1]); H,W = img.shape[:2]
poly = np.array([(950,445),(1267,443),(1080,910),(1370,912),(805,1605),(958,1115),(680,1115)], np.int32)
base = np.zeros((H,W),np.uint8); cv2.fillPoly(base,[poly],255)
fg = cv2.erode(base, np.ones((25,25),np.uint8))
pr = cv2.dilate(base, np.ones((41,41),np.uint8))
mask = np.full((H,W), cv2.GC_BGD, np.uint8)
mask[pr>0]=cv2.GC_PR_BGD; mask[base>0]=cv2.GC_PR_FGD; mask[fg>0]=cv2.GC_FGD
b=np.zeros((1,65)); f=np.zeros((1,65))
cv2.grabCut(img, mask, None, b, f, 6, cv2.GC_INIT_WITH_MASK)
m = np.where((mask==1)|(mask==3),255,0).astype(np.uint8)
m = cv2.morphologyEx(m, cv2.MORPH_OPEN, np.ones((3,3),np.uint8))
n,lab,st,_ = cv2.connectedComponentsWithStats(m); k=1+np.argmax(st[1:,4]); m=np.where(lab==k,255,0).astype(np.uint8)
lim = cv2.dilate(base, np.ones((9,9),np.uint8))
cv2.circle(lim,(1023,1022),168,255,-1)
m = cv2.bitwise_and(m, lim)
m = cv2.GaussianBlur(m,(3,3),0)
rgba = cv2.cvtColor(img, cv2.COLOR_BGR2BGRA); rgba[...,3]=m
ys,xs=np.where(m>10); rgba=rgba[ys.min():ys.max()+1, xs.min():xs.max()+1]
cv2.imwrite('rayo.png', rgba)
a=rgba[...,3:4]/255.0; d=np.zeros_like(rgba[...,:3]); d[:]=(43,27,11)
cv2.imwrite('rayo_prev.png',(rgba[...,:3]*a+d*(1-a)).astype(np.uint8))
print(rgba.shape)
