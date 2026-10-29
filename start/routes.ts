/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import { middleware } from '#start/kernel'
import { controllers } from '#generated/controllers'
import router from '@adonisjs/core/services/router'

router.on('/').renderInertia('home', {}).as('home')

router
  .group(() => {
    router.get('signup', [controllers.NewAccount, 'create'])
    router.post('signup', [controllers.NewAccount, 'store'])

    router.get('login', [controllers.Session, 'create'])
    router.post('login', [controllers.Session, 'store'])
  })
  .use(middleware.guest())

router
  .group(() => {
    router.get('/dashboard', [controllers.Dashboard, 'show']).as('dashboard')
    router.post('logout', [controllers.Session, 'destroy'])
  })
  .use(middleware.auth())

/**
 * Data console: one resource (7 CRUD routes) per table, e.g.
 * data.sponsors.index, .create, .store, .show, .edit, .update, .destroy
 */
router
  .group(() => {
    router.get('/', [controllers.DataOverview, 'show']).as('index')
    router.resource('members', controllers.Members)
    router.resource('sponsors', controllers.Sponsors)
    router.resource('sponsor_contacts', controllers.SponsorContacts)
    router.resource('commitments', controllers.Commitments)
    router.resource('interactions', controllers.Interactions)
    router.resource('follow_up_tasks', controllers.FollowUpTasks)
    router.resource('documents', controllers.Documents)
    router.resource('email_templates', controllers.EmailTemplates)
    router.resource('email_cases', controllers.EmailCases)
    router.resource('case_drafts', controllers.CaseDrafts)
    router.resource('case_recipients', controllers.CaseRecipients)
    router.resource('case_approvers', controllers.CaseApprovers)
    router.resource('case_events', controllers.CaseEvents)
  })
  .prefix('/data')
  .as('data')
  .use(middleware.auth())

router.get('/search', [controllers.Search, 'index']).as('search').use(middleware.auth())
