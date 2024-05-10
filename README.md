# Instagram
#### 프로젝트 이름
Instagram

#### 배포 링크
https://nextjs-instagram-rogdfcgfc-innas-projects-81fd8c82.vercel.app/auth/signin?callbackUrl=%2F

#### 사용한 라이브러리
vercel, next-auth, react-spinners, timeago.js, react-multi-carousel

#### 구현 사항
* 구글 계정으로 로그인, 로그아웃
* 사용자 검색기능
* 다른 사용자 팔로우, 언팔로우
* 게시물 좋아요, 북마크
* 나만의 게시물 작성
* 사용자가 작성한 게시물, 좋아요한 게시물, 북마크한 게시물 필터
* 다른 사용자 게시물에 댓글 달기

#### 주요 내용
* sanity studio를 사용해서 사용자, 포스트, 댓글 데이터를 관리
  * 사용자, 포스트 데이터 모델 스키마 정의한다.
  * 사용자 필드에는 사용자의 유저이름, 사용자 이름, 이메일, 사용자 이미지, 팔로잉, 팔로워 정의하는데 이때 팔로잉과 팔로워는 사용자 필드를 참고하는 배열타입이다.
  * 포스트 필드에는 작성자, 게시물 사진, 좋아요를 누른 사용자들, 댓글을 정의하는데 작성자와 좋아요는 사용자 필드를 참조하는 배열타입이고 댓글은 댓글 필드를 따로 만들어서 그 댓글 필드를 참조하는 배열타입이다.
  * Post content 미리보기를 구분하기 위해 list previews를 따로 작성했다.
* 로그인 구현
  * next-auth 라이브러리의 signIn, signOut으로 로그인, 로그아웃 기능을 구현했다.
  * GoogleProvider를 사용해서 Google로 로그인이 가능하다.
  * next-auth가 제공해주는 useSession hook을 이용해서 현재 로그인된 사용자의 session 정보를 받아와서 화면에 보여준다.
  * 로그인이 성공적으로 완료되면 sanity-client의 createclient를 사용해서 로그인한 사용자의 정보를 sanity에 추가한다.
* 백엔드 데이터 가져오기
  * swr의 useSWR을 사용했다.
  * GET 요청에서 next-auth의 getServerSession로 session 정보를 받아온 후 로그인한 사용자가 있다면 client의 fetch를 호출해서 데이터를 받아온다.
  * sanity 쿼리 언어인 GROQ를 사용해서 어떤 데이터를 받아올 지 설정했다.
* 검색 기능
  * fetch 할 때 keyword가 있다면 match를 사용해서 그 keyword와 동일한 name이나 username을 가져오고 keyword가 없다면 빈 문자열로 설정해서 모든 사용자에 대한 데이터를 가져온다.
  * 검색결과로 보여지는 사용자들의 정보에 만약 following이나 followers가 없다면 null이 아니라 0이 될 수 있도록 기본값을 0으로 설정한다.
* 좋아요, 북마크
  * 좋아요나 북마크를 했다면 toggle이 true가 되면서 채워진 아이콘을 보여주고 아니라면 false가 되면서 빈 아이콘을 보여준다.
  * PUT 요청으로 likes와 bookmarks를 업데이트 하는데 만약 toggle이 true라면 client의 patch, append를 사용하고 false라면 unset을 사용한다.
  * 데이터 업데이트가 성공적으로 완료되면 mutate로 전체 cache를 업데이트해서 최신 좋아요, 북마크 상태를 보여준다. 이때 최신 데이터를 받아올때까지 기다리는게 아니라 optimisticData 옵션을 줘서 UI상으로 업데이트 된 정보를 먼저 보여주고 데이터를 받아오면 그떄 다시 업데이트를 해준다.
* 댓글
  * patch와 append를 사용해서 댓글을 추가하는데 데이터를 업데이트 하는게 아니라 추가하는거라서 POST 요청을 한다.
  * 게시글 상세 페이지에서 댓글을 추가하면 postlist에 있는 게시글에 있는 댓글도 같이 업데이트 되어야하기 때문에 mutate를 이용해서 /api/posts 전체를 업데이트한다.
* 팔로우, 언팔로우
  * 팔로우를 누르게 되면 사용자의 팔로잉뿐만 아니라 상대방 팔로워도 변경이 일어나기 때문에 transaction을 사용해서 한번에 2개의 데이터를 다뤘다.
  * mutate를 이용해서 팔로우 버튼을 업데이트를 해줬는데 변경된 데이터가 2개 뿐이어서 따로 optimisticData 옵션은 주지 않았다.
  * 팔로우 버튼을 누르면 팔로우 버튼뿐만 아니라 사용자의 팔로잉 숫자도 즉각적으로 변경되어야하기 때문에 next에서 제공해주는 useRouter의 refresh를 사용해서 서버상에서 미리 렌더링 된 페이지도 업데이트를 해주었다.
* 새 포스트 작성
  * 이미지와 텍스트를 입력 후에 submit을 하면 이미지와 텍스트를 각각 file과 text 형태로 formdata에 추가한다.
  * 만들어둔 formdata를 전달하면서 POST 요청을 하면 route에서 전달받은 formdata와 사용자의 userId를 가지고 새 포스트를 만든다.
* SEO 최적화 및 점검
  * page마다 metadata를 설정해주는데 dynamic router에서는 next에서 제공해주는 generateMetadata 함수에 username을 전달해서 로그인한 사용자의 username이 나올 수 있도록 했다.
  * search 기능은 로그인을 하지 않아도 사용할 수 있기 때문에 따로 fetch를 하는게 없어서 static하게 SSG로 동작하는데 'force-dynamic'을 해줘서 요청이 오면 그떄 수행이 되도록 했다.

#### 문제 해결
* 새로운 게시물을 업로드할 때 postDetail에서 작성자의 이름과 사진이 보여지지 않았다.
  * newPost에서 formDate를 POST할 때 createPost 함수를 불러오는데 createPost에서 문제가 있는 것 같았다. console.log로 문제를 추적해보니 사용자의 username과 image가 null로 저장되어 있었다. createPost에서 author와 comments의 작성자의 _type을 reference로 지정해주었더니 정상적으로 잘 나왔다. 이때 type이어도 안되고 _type으로 명시해야만 잘 작동되었다.
* Post들의 정보를 받아와서 화면에 Post 목록을 보여주려고 했는데 Post의 제목만 가져와지고 image는 가져와지지 않았다
  * log를 찍어서 확인해보니 sanity의 Post에서 받아온 photo가 image에 그대로 할당이 되어서 url이 아니라 asset 객체에 reference 형태로 있어서 이미지가 보이지 않았던거였다. url로 받아오고 싶어서 asset에 있는 데이터에 접근해봤다. 그런데 sanity 공식 홈페이지를 살펴보다 보니 asset으로 직접 imageUrl을 가져오게 되면 최적화가 되지 않은 전체 사이즈의 이미지를 가져오기 때문에 좋지 않다고 나와있었다. 그래서 sanity에서 제안하고 있는 image-url을 사용해서 url을 가져오려고 시도해봤다. urlFor 함수를 만들고 그 안에서 image-url에서 제공해주는 imageUrlBuilder에 client를 전달한 다음 image의 url 함수를 호출했다. 그런 다음에 post 정보를 가져오는 함수에서 fetch가 성공적으로 끝나면 포스트들을 다시 map해서 image를 제외한 나머지 기존 정보들을 그대로 두고 image에는 만들어두었던 urlFor 함수에 photo를 전달해서 호출했더니 이미지가 정상적으로 잘 나왔다.
* 따로 에러가 발생하는 건 아니지만 콘솔창에 경고메세지가 떠서 살펴보니까 서버상에서 렌더링한 UI와 클라이언트에서 보여주는 style이 매칭되지 않는다고 나와있었다
  * style이 매칭되지 않는다는게 무슨 말인지 모르겠어서 구글에 검색도 해보고 콘솔의 network 탭에서도 확인해보니까 loading중일 때 보여주려고 만들어두었던 loading spinner가 문제인것같았다. nextjs가 사용자한테 보여주려고 미리 만들어둔 화면과 실제 화면이 달라서가 아닐까 싶어서 미리 만들어지는 화면에는 포함시키지 말고 필요할때만 실행되도록 하고 싶었다. 방법을 찾다보니 nextjs 공식 홈페이지에서 lazy loading이라고 경로를 렌더링할 때 클라이언트 구성 요소 및 가져온 라이브러리의 로드를 연기하고 필요할 때만 포함시킬 수 있는 게 있다고 해서 이 방법을 사용해보기로 했다. loading spinner를 가지고 있는 GridLoader를 바로 쓰지 않고 컴포넌트로 한번 더 감쌌다. 그런 다음에 nextjs 홈페이지에 나와있는것처럼 dynamic import에 react-spinners를 전달해주고 import가 완료가 되면 전달된 라이브러리 중에서 GridLoader를 사용하겠다고 해주었다. 그리고 옵션으로 ssr을 false로 지정해서 서버에서 미리 렌더링하지 않도록 설정해주었더니 경고 메시지가 사라졌다
* 검색창에서 사용자를 검색하는 경우 모든 철자를 타이핑 할 때마다 swr이 네트워크 요청을 하고 있어서 sanity에 여러번 접근을 하게 되니까 성능에 좋지 않았다
  * 검색창에 keyword를 입력하는 도중에 멈추면 그 때 네트워크 요청을 하는게 어떨까 생각했다. 검색어 자동완성기능처럼 이벤트가 빈번히 발생하는 곳에서는 요청을 줄여서 속도를 개선하기 위해 debounce를 해줘야한다는 것을 알게되었고 vercel의 swr 페이지에서 찾은 방법을 적용했다. useDebounce라는 hook을 만들고 value와 delay를 입력받았다. useState로 debounced의 초기값을 value로 설정해준다음 useEffect에서 value가 변경이 될 때마다 전달받은 delay만큼 setTimeout을 해줘서 debounced 값을 재설정했다. 그리고 그 delay 시간만큼이 지나지 않았는데 또 value가 변경이 된다면 clearTimeout을 호출해서 앞전에 Timeout은 취소되도록 하였다. 그럼 최종적으로는 더 이상 value가 변경이 되지 않는 타이핑이 끝난 시점의 keyword가 debounced가 된다. 사용자 검색을 하는 UserSearch에서 useDebounce에 keyword를 전달해서 호출하고 debounce된 keyword를 얻었다. 얻은 keyword를 useSWR에 전달하고 콘솔창으로 확인하면서 검색창에 타이핑을 해봤더니 멈춘 시점에 한번만 네트워크 요청이 가는 것을 확인할 수 있었다.
* Home의 게시물은 좋아요와 북마크 버튼이 정상적으로 작동하는데 사용자 페이지에 있는 게시물의 좋아요, 북마크 버튼은 동작하지 않았다
  * post를 가져올 때 문제가 있는것 같아서 살펴봤더니 Home에서 게시물들을 가져올 때 사용하는 key와 사용자 페이지에서 게시물을 가져올 때 사용하는 key가 달랐다. 사용자 페이지에서는 tab마다 다른 게시물들을 가져와야했기 때문에 key를 다르게 줬었다. 그랬더니 Home의 게시물들을 optimisticData로 즉각적으로 변경이 일어나지만 사용자 페이지는 key가 달라서 변경이 일어나지 않는거였다 . 우선 Context를 만들고 기본키값을 정해서 따로 key값을 전달받지 않는 한 기본키값을 쓰도록 했다. 그리고 탭이 있는 사용자 페이지만 Context.provider로 감싸고 postkey를 전달했더니 사용자 페이지에서는 기본키값을 쓰지않고 전달받은 postkey를 써서 데이터를 받아왔다. 이렇게 해주니까 사용자 페이지에서 탭마다 다른 게시물을 보여줄 때만 postkey를 사용하고 나머지 게시물은 모두 기본키값으로 데이터를 받아왔다. 좋아요 정보가 필요한 모든 컴포넌트의 key값을 통일해주니까 정상적으로 좋아요 버튼이 잘 작동했다.

#### 배포 에러와 해결 과정
* vercel로 배포를 시도를 했고 성공적으로 완료되었으나 배포 주소로 들어가니 'sign with Google' 버튼이 보이지 않아서 로그인 할 수가 없었다.
  * 배포는 됐는데 vercel.app 다음에 auth가 나온걸 보니 url 주소에 문제가 있는 것 같아서 환경 변수를 살펴보았다. NEXTAUTH_URL은 http://localhost:3000라서 따로 환경 변수로 추가하지 않았는데 이게 문제인 것 같았다. 그래서 환경 변수 NEXTAUTH_URL key에 value로 이전에 배포했던 url 주소를 추가하고 재배포를 시도했더니 로그인 버튼 잘 나왔다.
* google 로그인 버튼을 눌렀는데 '이 앱의 요청이 잘못되었습니다. 액세스가 차단되었습니다'라는 창이 떴다.
  * google cloud의 credentials 탭에서 url을 추가해주었다. Authorised JavaScript origins에 배포된 주소를 추가하고 로그인이 되면 redirect 해줘야하니까 authorised redirect URLs에도 배포된 주소에 /api/auth/callback/google을 붙여서 추가했다. 그랬더니 차단되지 않고 성공적으로 로그인할 수 있었다.
