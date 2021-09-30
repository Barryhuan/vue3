import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
	history: createWebHashHistory(),
	routes: [
		{
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      component: () => import('@p/login'),
      meta: {
        requireAuth: true
      }
    },
    {
      path: '/home',
      redirect: '/home/overview',
      component: () => import('@p/home'),
      children: [
        {
          path: 'overview',
          component: () => import('@p/detail/overview'),
        },
        {
          path: 'crowd',
          redirect: 'crowd/home',
          component: () => import('@p/detail/crowd/crowd'),
          children: [
            {
              path: 'home',
              component: () => import('@p/detail/crowd/home')
            },
            {
              path: 'company',
              component: () => import('@p/detail/crowd/home')
            },
            {
              path: 'flow',
              component: () => import('@p/detail/crowd/home')
            },
          ]
        },
        {
          path: 'heatmap',
          component: () => import('@p/detail/heatmap')
        },
        {
          path: 'distribution',
          redirect: 'distribution/home',
          component: () => import('@p/detail/distribution/distribution'),
          children: [
            {
              path: 'home',
              component: () => import('@p/detail/distribution/home'),
            },
            {
              path: 'company',
              component: () => import('@p/detail/distribution/home'),
            }
          ]
        },
        {
          path: 'environment',
          redirect: 'environment/business',
          component: () => import('@p/detail/environment/environment'),
          children: [
            {
              path: 'business',
              component: () => import('@p/detail/environment/business'),
            },
            {
              path: 'brand',
              component: () => import('@p/detail/environment/brand'),
            }
          ]
        }
      ]
    },
    {
      path: '/user',
      redirect: '/user/task',
      component: () => import('@p/user/user'),
      children: [
        {
          path: 'task',
          component: () => import('@p/user/task')
        }
      ]
    },
    {
      path: '/point/create',
      component: () => import('@p/point/create')
    }
	]
})

router.beforeEach(async (to, from, next) => {
  console.log(to, from)
  let store = router.app.$options.store
  Message.closeAll()
  if (!from.meta.requireAuth) {
    if (!localStorage.getItem('STATUS_HSH')&&
      to.path !== '/login' &&
      from.path === '/'
    ) {
      next('/login')
    } else if (!to.matched.length) {
      console.log('路由：' + 1)
      if (Object.keys(from.query).length) {
        from.path ? next({ path: from.path, query: { id: store.state.pointId }}) : next('/')
      } else {
        next({ path: from.path })
      }
    } else if (to.path === from.path &&
      (!Object.keys(to.query).length || !to.query.id) &&
      (Object.keys(from.query).length && from.query.id)
    ) {
      console.log('路由：' + 3)
      await store.dispatch('getPointList', { token: localStorage.getItem('STATUS_HSH') })
      next({ path: to.path, query: { id: store.state.pointId }})
    } else if (to.path === '/login' && localStorage.getItem('STATUS_HSH')) {
      console.log('路由：' + 4)
      if (store.state.pointId) {
        console.log('路由：' + 4.1)
        next({ path: 'home/overview', query: { id: store.state.pointId }})
      } else {
        console.log('路由：' + 4.2)
        await store.dispatch('getPointList', { token: localStorage.getItem('STATUS_HSH') })
        await store.dispatch('getCityList', localStorage.getItem('STATUS_HSH'))
        store.dispatch('setCityId', JSON.parse(localStorage.getItem('cityId')))
        store.dispatch('setPointId', JSON.parse(localStorage.getItem('pointId')))
        next({ path: 'home/overview', query: { id: localStorage.getItem('pointId')}})
      }
    } else if (
      Object.keys(to.query).length &&
      !to.query.id  &&
      ['login', 'create', 'task'].every(el => !to.path.includes(el)) &&
      from.path === '/' &&
      localStorage.getItem('STATUS_HSH')
    ) {
      console.log('路由：' + 5)
      await store.dispatch('getPointList', { token: localStorage.getItem('STATUS_HSH') })
      await store.dispatch('getUserInfo', localStorage.getItem('STATUS_HSH'))
      next({ path: to.path, query: { id: localStorage.getItem('pointId') }})
    } else {
      // console.log(localStorage.getItem('isWindowClose'))
      console.log('路由：' + 6)
      // if (localStorage.getItem('isWindowClose') && localStorage.getItem('STATUS_HSH')) {
      //   await store.dispatch('getPointList', { token: localStorage.getItem('STATUS_HSH'), cityId: localStorage.getItem('cityId')})
      //   await store.dispatch('getUserInfo', localStorage.getItem('STATUS_HSH'))
      //   await store.dispatch('getCityList', localStorage.getItem('STATUS_HSH'))
      //   store.dispatch('setPointId', JSON.parse(localStorage.getItem('pointId')))
      //   store.dispatch('setCityId', JSON.parse(localStorage.getItem('cityId')))
      //   localStorage.removeItem('isWindowClose')
      // }
      next()
    }
  } else {
    if (localStorage.getItem('STATUS_HSH')) {
      Message({
        ...CONFIG_MESSAGE_SUCCESS('欢迎您进入好商汇天启系统')
      })
      setTimeout(() => {
        // isTokenMove = !1
        console.log('路由：' + 7)
        next()
      }, 1000)
    } else {
      Message({...CONFIG_MESSAGE_WARNING('请您先登录')})
        console.log('路由：' + 8)
      next(!1)
    }
  }
})

export default router
