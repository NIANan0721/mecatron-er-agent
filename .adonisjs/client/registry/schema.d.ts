/* eslint-disable prettier/prettier */
/// <reference path="../manifest.d.ts" />

import type { ExtractBody, ExtractErrorResponse, ExtractQuery, ExtractQueryForGet, ExtractRawResponse, ExtractResponse, Method, PathWithRegistry, PatternsByMethod, RouteWithRegistry } from '@tuyau/core/types'
import type { InferInput, SimpleError } from '@vinejs/vine/types'
import type { routes } from './index.ts'

export type ParamValue = string | number | bigint | boolean

export interface Registry {
  'home': {
    methods: ["GET","HEAD"]
    pattern: '/'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: unknown
      errorResponse: unknown
      rawResponse: ExtractRawResponse<unknown>
    }
  }
  'new_account.create': {
    methods: ["GET","HEAD"]
    pattern: '/signup'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/new_account_controller').default['create']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/new_account_controller').default['create']>>>
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/new_account_controller').default['create']>>>
    }
  }
  'new_account.store': {
    methods: ["POST"]
    pattern: '/signup'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/user').signupValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/user').signupValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/new_account_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/new_account_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/new_account_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'session.create': {
    methods: ["GET","HEAD"]
    pattern: '/login'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/session_controller').default['create']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/session_controller').default['create']>>>
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/session_controller').default['create']>>>
    }
  }
  'session.store': {
    methods: ["POST"]
    pattern: '/login'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/user').loginValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/user').loginValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/session_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/session_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/session_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'dashboard': {
    methods: ["GET","HEAD"]
    pattern: '/dashboard'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/dashboard_controller').default['show']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/dashboard_controller').default['show']>>>
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/dashboard_controller').default['show']>>>
    }
  }
  'session.destroy': {
    methods: ["POST"]
    pattern: '/logout'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/session_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/session_controller').default['destroy']>>>
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/session_controller').default['destroy']>>>
    }
  }
  'data.index': {
    methods: ["GET","HEAD"]
    pattern: '/data'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/data_overview_controller').default['show']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/data_overview_controller').default['show']>>>
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/data_overview_controller').default['show']>>>
    }
  }
  'data.members.index': {
    methods: ["GET","HEAD"]
    pattern: '/data/members'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/members_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/members_controller').default['index']>>>
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/members_controller').default['index']>>>
    }
  }
  'data.members.create': {
    methods: ["GET","HEAD"]
    pattern: '/data/members/create'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/members_controller').default['create']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/members_controller').default['create']>>>
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/members_controller').default['create']>>>
    }
  }
  'data.members.store': {
    methods: ["POST"]
    pattern: '/data/members'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/member').memberValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/member').memberValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/members_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/members_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/members_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'data.members.show': {
    methods: ["GET","HEAD"]
    pattern: '/data/members/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/members_controller').default['show']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/members_controller').default['show']>>>
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/members_controller').default['show']>>>
    }
  }
  'data.members.edit': {
    methods: ["GET","HEAD"]
    pattern: '/data/members/:id/edit'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/members_controller').default['edit']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/members_controller').default['edit']>>>
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/members_controller').default['edit']>>>
    }
  }
  'data.members.update': {
    methods: ["PUT","PATCH"]
    pattern: '/data/members/:id'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/member').memberValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/member').memberValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/members_controller').default['update']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/members_controller').default['update']>>> | { status: 422; response: { errors: SimpleError[] } }
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/members_controller').default['update']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'data.members.destroy': {
    methods: ["DELETE"]
    pattern: '/data/members/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/members_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/members_controller').default['destroy']>>>
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/members_controller').default['destroy']>>>
    }
  }
  'data.sponsors.index': {
    methods: ["GET","HEAD"]
    pattern: '/data/sponsors'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/sponsors_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/sponsors_controller').default['index']>>>
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/sponsors_controller').default['index']>>>
    }
  }
  'data.sponsors.create': {
    methods: ["GET","HEAD"]
    pattern: '/data/sponsors/create'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/sponsors_controller').default['create']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/sponsors_controller').default['create']>>>
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/sponsors_controller').default['create']>>>
    }
  }
  'data.sponsors.store': {
    methods: ["POST"]
    pattern: '/data/sponsors'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/sponsor').sponsorValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/sponsor').sponsorValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/sponsors_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/sponsors_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/sponsors_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'data.sponsors.show': {
    methods: ["GET","HEAD"]
    pattern: '/data/sponsors/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/sponsors_controller').default['show']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/sponsors_controller').default['show']>>>
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/sponsors_controller').default['show']>>>
    }
  }
  'data.sponsors.edit': {
    methods: ["GET","HEAD"]
    pattern: '/data/sponsors/:id/edit'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/sponsors_controller').default['edit']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/sponsors_controller').default['edit']>>>
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/sponsors_controller').default['edit']>>>
    }
  }
  'data.sponsors.update': {
    methods: ["PUT","PATCH"]
    pattern: '/data/sponsors/:id'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/sponsor').sponsorValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/sponsor').sponsorValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/sponsors_controller').default['update']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/sponsors_controller').default['update']>>> | { status: 422; response: { errors: SimpleError[] } }
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/sponsors_controller').default['update']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'data.sponsors.destroy': {
    methods: ["DELETE"]
    pattern: '/data/sponsors/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/sponsors_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/sponsors_controller').default['destroy']>>>
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/sponsors_controller').default['destroy']>>>
    }
  }
  'data.sponsor_contacts.index': {
    methods: ["GET","HEAD"]
    pattern: '/data/sponsor_contacts'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/sponsor_contacts_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/sponsor_contacts_controller').default['index']>>>
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/sponsor_contacts_controller').default['index']>>>
    }
  }
  'data.sponsor_contacts.create': {
    methods: ["GET","HEAD"]
    pattern: '/data/sponsor_contacts/create'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/sponsor_contacts_controller').default['create']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/sponsor_contacts_controller').default['create']>>>
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/sponsor_contacts_controller').default['create']>>>
    }
  }
  'data.sponsor_contacts.store': {
    methods: ["POST"]
    pattern: '/data/sponsor_contacts'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/sponsor_contact').sponsorContactValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/sponsor_contact').sponsorContactValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/sponsor_contacts_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/sponsor_contacts_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/sponsor_contacts_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'data.sponsor_contacts.show': {
    methods: ["GET","HEAD"]
    pattern: '/data/sponsor_contacts/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/sponsor_contacts_controller').default['show']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/sponsor_contacts_controller').default['show']>>>
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/sponsor_contacts_controller').default['show']>>>
    }
  }
  'data.sponsor_contacts.edit': {
    methods: ["GET","HEAD"]
    pattern: '/data/sponsor_contacts/:id/edit'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/sponsor_contacts_controller').default['edit']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/sponsor_contacts_controller').default['edit']>>>
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/sponsor_contacts_controller').default['edit']>>>
    }
  }
  'data.sponsor_contacts.update': {
    methods: ["PUT","PATCH"]
    pattern: '/data/sponsor_contacts/:id'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/sponsor_contact').sponsorContactValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/sponsor_contact').sponsorContactValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/sponsor_contacts_controller').default['update']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/sponsor_contacts_controller').default['update']>>> | { status: 422; response: { errors: SimpleError[] } }
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/sponsor_contacts_controller').default['update']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'data.sponsor_contacts.destroy': {
    methods: ["DELETE"]
    pattern: '/data/sponsor_contacts/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/sponsor_contacts_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/sponsor_contacts_controller').default['destroy']>>>
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/sponsor_contacts_controller').default['destroy']>>>
    }
  }
  'data.commitments.index': {
    methods: ["GET","HEAD"]
    pattern: '/data/commitments'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/commitments_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/commitments_controller').default['index']>>>
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/commitments_controller').default['index']>>>
    }
  }
  'data.commitments.create': {
    methods: ["GET","HEAD"]
    pattern: '/data/commitments/create'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/commitments_controller').default['create']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/commitments_controller').default['create']>>>
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/commitments_controller').default['create']>>>
    }
  }
  'data.commitments.store': {
    methods: ["POST"]
    pattern: '/data/commitments'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/commitment').commitmentValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/commitment').commitmentValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/commitments_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/commitments_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/commitments_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'data.commitments.show': {
    methods: ["GET","HEAD"]
    pattern: '/data/commitments/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/commitments_controller').default['show']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/commitments_controller').default['show']>>>
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/commitments_controller').default['show']>>>
    }
  }
  'data.commitments.edit': {
    methods: ["GET","HEAD"]
    pattern: '/data/commitments/:id/edit'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/commitments_controller').default['edit']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/commitments_controller').default['edit']>>>
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/commitments_controller').default['edit']>>>
    }
  }
  'data.commitments.update': {
    methods: ["PUT","PATCH"]
    pattern: '/data/commitments/:id'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/commitment').commitmentValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/commitment').commitmentValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/commitments_controller').default['update']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/commitments_controller').default['update']>>> | { status: 422; response: { errors: SimpleError[] } }
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/commitments_controller').default['update']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'data.commitments.destroy': {
    methods: ["DELETE"]
    pattern: '/data/commitments/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/commitments_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/commitments_controller').default['destroy']>>>
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/commitments_controller').default['destroy']>>>
    }
  }
  'data.interactions.index': {
    methods: ["GET","HEAD"]
    pattern: '/data/interactions'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/interactions_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/interactions_controller').default['index']>>>
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/interactions_controller').default['index']>>>
    }
  }
  'data.interactions.create': {
    methods: ["GET","HEAD"]
    pattern: '/data/interactions/create'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/interactions_controller').default['create']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/interactions_controller').default['create']>>>
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/interactions_controller').default['create']>>>
    }
  }
  'data.interactions.store': {
    methods: ["POST"]
    pattern: '/data/interactions'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/interaction').interactionValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/interaction').interactionValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/interactions_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/interactions_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/interactions_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'data.interactions.show': {
    methods: ["GET","HEAD"]
    pattern: '/data/interactions/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/interactions_controller').default['show']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/interactions_controller').default['show']>>>
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/interactions_controller').default['show']>>>
    }
  }
  'data.interactions.edit': {
    methods: ["GET","HEAD"]
    pattern: '/data/interactions/:id/edit'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/interactions_controller').default['edit']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/interactions_controller').default['edit']>>>
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/interactions_controller').default['edit']>>>
    }
  }
  'data.interactions.update': {
    methods: ["PUT","PATCH"]
    pattern: '/data/interactions/:id'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/interaction').interactionValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/interaction').interactionValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/interactions_controller').default['update']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/interactions_controller').default['update']>>> | { status: 422; response: { errors: SimpleError[] } }
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/interactions_controller').default['update']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'data.interactions.destroy': {
    methods: ["DELETE"]
    pattern: '/data/interactions/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/interactions_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/interactions_controller').default['destroy']>>>
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/interactions_controller').default['destroy']>>>
    }
  }
  'data.follow_up_tasks.index': {
    methods: ["GET","HEAD"]
    pattern: '/data/follow_up_tasks'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/follow_up_tasks_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/follow_up_tasks_controller').default['index']>>>
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/follow_up_tasks_controller').default['index']>>>
    }
  }
  'data.follow_up_tasks.create': {
    methods: ["GET","HEAD"]
    pattern: '/data/follow_up_tasks/create'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/follow_up_tasks_controller').default['create']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/follow_up_tasks_controller').default['create']>>>
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/follow_up_tasks_controller').default['create']>>>
    }
  }
  'data.follow_up_tasks.store': {
    methods: ["POST"]
    pattern: '/data/follow_up_tasks'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/follow_up_task').followUpTaskValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/follow_up_task').followUpTaskValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/follow_up_tasks_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/follow_up_tasks_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/follow_up_tasks_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'data.follow_up_tasks.show': {
    methods: ["GET","HEAD"]
    pattern: '/data/follow_up_tasks/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/follow_up_tasks_controller').default['show']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/follow_up_tasks_controller').default['show']>>>
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/follow_up_tasks_controller').default['show']>>>
    }
  }
  'data.follow_up_tasks.edit': {
    methods: ["GET","HEAD"]
    pattern: '/data/follow_up_tasks/:id/edit'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/follow_up_tasks_controller').default['edit']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/follow_up_tasks_controller').default['edit']>>>
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/follow_up_tasks_controller').default['edit']>>>
    }
  }
  'data.follow_up_tasks.update': {
    methods: ["PUT","PATCH"]
    pattern: '/data/follow_up_tasks/:id'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/follow_up_task').followUpTaskValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/follow_up_task').followUpTaskValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/follow_up_tasks_controller').default['update']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/follow_up_tasks_controller').default['update']>>> | { status: 422; response: { errors: SimpleError[] } }
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/follow_up_tasks_controller').default['update']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'data.follow_up_tasks.destroy': {
    methods: ["DELETE"]
    pattern: '/data/follow_up_tasks/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/follow_up_tasks_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/follow_up_tasks_controller').default['destroy']>>>
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/follow_up_tasks_controller').default['destroy']>>>
    }
  }
  'data.documents.index': {
    methods: ["GET","HEAD"]
    pattern: '/data/documents'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/documents_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/documents_controller').default['index']>>>
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/documents_controller').default['index']>>>
    }
  }
  'data.documents.create': {
    methods: ["GET","HEAD"]
    pattern: '/data/documents/create'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/documents_controller').default['create']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/documents_controller').default['create']>>>
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/documents_controller').default['create']>>>
    }
  }
  'data.documents.store': {
    methods: ["POST"]
    pattern: '/data/documents'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/document').documentValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/document').documentValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/documents_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/documents_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/documents_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'data.documents.show': {
    methods: ["GET","HEAD"]
    pattern: '/data/documents/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/documents_controller').default['show']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/documents_controller').default['show']>>>
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/documents_controller').default['show']>>>
    }
  }
  'data.documents.edit': {
    methods: ["GET","HEAD"]
    pattern: '/data/documents/:id/edit'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/documents_controller').default['edit']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/documents_controller').default['edit']>>>
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/documents_controller').default['edit']>>>
    }
  }
  'data.documents.update': {
    methods: ["PUT","PATCH"]
    pattern: '/data/documents/:id'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/document').documentValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/document').documentValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/documents_controller').default['update']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/documents_controller').default['update']>>> | { status: 422; response: { errors: SimpleError[] } }
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/documents_controller').default['update']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'data.documents.destroy': {
    methods: ["DELETE"]
    pattern: '/data/documents/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/documents_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/documents_controller').default['destroy']>>>
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/documents_controller').default['destroy']>>>
    }
  }
  'data.email_templates.index': {
    methods: ["GET","HEAD"]
    pattern: '/data/email_templates'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/email_templates_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/email_templates_controller').default['index']>>>
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/email_templates_controller').default['index']>>>
    }
  }
  'data.email_templates.create': {
    methods: ["GET","HEAD"]
    pattern: '/data/email_templates/create'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/email_templates_controller').default['create']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/email_templates_controller').default['create']>>>
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/email_templates_controller').default['create']>>>
    }
  }
  'data.email_templates.store': {
    methods: ["POST"]
    pattern: '/data/email_templates'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/email_template').emailTemplateValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/email_template').emailTemplateValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/email_templates_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/email_templates_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/email_templates_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'data.email_templates.show': {
    methods: ["GET","HEAD"]
    pattern: '/data/email_templates/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/email_templates_controller').default['show']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/email_templates_controller').default['show']>>>
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/email_templates_controller').default['show']>>>
    }
  }
  'data.email_templates.edit': {
    methods: ["GET","HEAD"]
    pattern: '/data/email_templates/:id/edit'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/email_templates_controller').default['edit']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/email_templates_controller').default['edit']>>>
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/email_templates_controller').default['edit']>>>
    }
  }
  'data.email_templates.update': {
    methods: ["PUT","PATCH"]
    pattern: '/data/email_templates/:id'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/email_template').emailTemplateValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/email_template').emailTemplateValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/email_templates_controller').default['update']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/email_templates_controller').default['update']>>> | { status: 422; response: { errors: SimpleError[] } }
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/email_templates_controller').default['update']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'data.email_templates.destroy': {
    methods: ["DELETE"]
    pattern: '/data/email_templates/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/email_templates_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/email_templates_controller').default['destroy']>>>
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/email_templates_controller').default['destroy']>>>
    }
  }
  'data.email_cases.index': {
    methods: ["GET","HEAD"]
    pattern: '/data/email_cases'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/email_cases_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/email_cases_controller').default['index']>>>
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/email_cases_controller').default['index']>>>
    }
  }
  'data.email_cases.create': {
    methods: ["GET","HEAD"]
    pattern: '/data/email_cases/create'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/email_cases_controller').default['create']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/email_cases_controller').default['create']>>>
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/email_cases_controller').default['create']>>>
    }
  }
  'data.email_cases.store': {
    methods: ["POST"]
    pattern: '/data/email_cases'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/email_case').emailCaseValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/email_case').emailCaseValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/email_cases_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/email_cases_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/email_cases_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'data.email_cases.show': {
    methods: ["GET","HEAD"]
    pattern: '/data/email_cases/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/email_cases_controller').default['show']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/email_cases_controller').default['show']>>>
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/email_cases_controller').default['show']>>>
    }
  }
  'data.email_cases.edit': {
    methods: ["GET","HEAD"]
    pattern: '/data/email_cases/:id/edit'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/email_cases_controller').default['edit']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/email_cases_controller').default['edit']>>>
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/email_cases_controller').default['edit']>>>
    }
  }
  'data.email_cases.update': {
    methods: ["PUT","PATCH"]
    pattern: '/data/email_cases/:id'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/email_case').emailCaseValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/email_case').emailCaseValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/email_cases_controller').default['update']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/email_cases_controller').default['update']>>> | { status: 422; response: { errors: SimpleError[] } }
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/email_cases_controller').default['update']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'data.email_cases.destroy': {
    methods: ["DELETE"]
    pattern: '/data/email_cases/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/email_cases_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/email_cases_controller').default['destroy']>>>
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/email_cases_controller').default['destroy']>>>
    }
  }
  'data.case_drafts.index': {
    methods: ["GET","HEAD"]
    pattern: '/data/case_drafts'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/case_drafts_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/case_drafts_controller').default['index']>>>
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/case_drafts_controller').default['index']>>>
    }
  }
  'data.case_drafts.create': {
    methods: ["GET","HEAD"]
    pattern: '/data/case_drafts/create'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/case_drafts_controller').default['create']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/case_drafts_controller').default['create']>>>
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/case_drafts_controller').default['create']>>>
    }
  }
  'data.case_drafts.store': {
    methods: ["POST"]
    pattern: '/data/case_drafts'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/case_draft').caseDraftValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/case_draft').caseDraftValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/case_drafts_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/case_drafts_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/case_drafts_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'data.case_drafts.show': {
    methods: ["GET","HEAD"]
    pattern: '/data/case_drafts/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/case_drafts_controller').default['show']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/case_drafts_controller').default['show']>>>
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/case_drafts_controller').default['show']>>>
    }
  }
  'data.case_drafts.edit': {
    methods: ["GET","HEAD"]
    pattern: '/data/case_drafts/:id/edit'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/case_drafts_controller').default['edit']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/case_drafts_controller').default['edit']>>>
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/case_drafts_controller').default['edit']>>>
    }
  }
  'data.case_drafts.update': {
    methods: ["PUT","PATCH"]
    pattern: '/data/case_drafts/:id'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/case_draft').caseDraftValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/case_draft').caseDraftValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/case_drafts_controller').default['update']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/case_drafts_controller').default['update']>>> | { status: 422; response: { errors: SimpleError[] } }
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/case_drafts_controller').default['update']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'data.case_drafts.destroy': {
    methods: ["DELETE"]
    pattern: '/data/case_drafts/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/case_drafts_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/case_drafts_controller').default['destroy']>>>
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/case_drafts_controller').default['destroy']>>>
    }
  }
  'data.case_recipients.index': {
    methods: ["GET","HEAD"]
    pattern: '/data/case_recipients'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/case_recipients_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/case_recipients_controller').default['index']>>>
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/case_recipients_controller').default['index']>>>
    }
  }
  'data.case_recipients.create': {
    methods: ["GET","HEAD"]
    pattern: '/data/case_recipients/create'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/case_recipients_controller').default['create']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/case_recipients_controller').default['create']>>>
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/case_recipients_controller').default['create']>>>
    }
  }
  'data.case_recipients.store': {
    methods: ["POST"]
    pattern: '/data/case_recipients'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/case_recipient').caseRecipientValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/case_recipient').caseRecipientValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/case_recipients_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/case_recipients_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/case_recipients_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'data.case_recipients.show': {
    methods: ["GET","HEAD"]
    pattern: '/data/case_recipients/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/case_recipients_controller').default['show']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/case_recipients_controller').default['show']>>>
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/case_recipients_controller').default['show']>>>
    }
  }
  'data.case_recipients.edit': {
    methods: ["GET","HEAD"]
    pattern: '/data/case_recipients/:id/edit'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/case_recipients_controller').default['edit']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/case_recipients_controller').default['edit']>>>
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/case_recipients_controller').default['edit']>>>
    }
  }
  'data.case_recipients.update': {
    methods: ["PUT","PATCH"]
    pattern: '/data/case_recipients/:id'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/case_recipient').caseRecipientValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/case_recipient').caseRecipientValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/case_recipients_controller').default['update']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/case_recipients_controller').default['update']>>> | { status: 422; response: { errors: SimpleError[] } }
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/case_recipients_controller').default['update']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'data.case_recipients.destroy': {
    methods: ["DELETE"]
    pattern: '/data/case_recipients/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/case_recipients_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/case_recipients_controller').default['destroy']>>>
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/case_recipients_controller').default['destroy']>>>
    }
  }
  'data.case_approvers.index': {
    methods: ["GET","HEAD"]
    pattern: '/data/case_approvers'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/case_approvers_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/case_approvers_controller').default['index']>>>
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/case_approvers_controller').default['index']>>>
    }
  }
  'data.case_approvers.create': {
    methods: ["GET","HEAD"]
    pattern: '/data/case_approvers/create'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/case_approvers_controller').default['create']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/case_approvers_controller').default['create']>>>
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/case_approvers_controller').default['create']>>>
    }
  }
  'data.case_approvers.store': {
    methods: ["POST"]
    pattern: '/data/case_approvers'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/case_approver').caseApproverValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/case_approver').caseApproverValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/case_approvers_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/case_approvers_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/case_approvers_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'data.case_approvers.show': {
    methods: ["GET","HEAD"]
    pattern: '/data/case_approvers/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/case_approvers_controller').default['show']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/case_approvers_controller').default['show']>>>
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/case_approvers_controller').default['show']>>>
    }
  }
  'data.case_approvers.edit': {
    methods: ["GET","HEAD"]
    pattern: '/data/case_approvers/:id/edit'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/case_approvers_controller').default['edit']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/case_approvers_controller').default['edit']>>>
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/case_approvers_controller').default['edit']>>>
    }
  }
  'data.case_approvers.update': {
    methods: ["PUT","PATCH"]
    pattern: '/data/case_approvers/:id'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/case_approver').caseApproverValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/case_approver').caseApproverValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/case_approvers_controller').default['update']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/case_approvers_controller').default['update']>>> | { status: 422; response: { errors: SimpleError[] } }
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/case_approvers_controller').default['update']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'data.case_approvers.destroy': {
    methods: ["DELETE"]
    pattern: '/data/case_approvers/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/case_approvers_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/case_approvers_controller').default['destroy']>>>
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/case_approvers_controller').default['destroy']>>>
    }
  }
  'data.case_events.index': {
    methods: ["GET","HEAD"]
    pattern: '/data/case_events'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/case_events_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/case_events_controller').default['index']>>>
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/case_events_controller').default['index']>>>
    }
  }
  'data.case_events.create': {
    methods: ["GET","HEAD"]
    pattern: '/data/case_events/create'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/case_events_controller').default['create']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/case_events_controller').default['create']>>>
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/case_events_controller').default['create']>>>
    }
  }
  'data.case_events.store': {
    methods: ["POST"]
    pattern: '/data/case_events'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/case_event').caseEventValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/case_event').caseEventValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/case_events_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/case_events_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/case_events_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'data.case_events.show': {
    methods: ["GET","HEAD"]
    pattern: '/data/case_events/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/case_events_controller').default['show']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/case_events_controller').default['show']>>>
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/case_events_controller').default['show']>>>
    }
  }
  'data.case_events.edit': {
    methods: ["GET","HEAD"]
    pattern: '/data/case_events/:id/edit'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/case_events_controller').default['edit']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/case_events_controller').default['edit']>>>
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/case_events_controller').default['edit']>>>
    }
  }
  'data.case_events.update': {
    methods: ["PUT","PATCH"]
    pattern: '/data/case_events/:id'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/case_event').caseEventValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/case_event').caseEventValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/case_events_controller').default['update']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/case_events_controller').default['update']>>> | { status: 422; response: { errors: SimpleError[] } }
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/case_events_controller').default['update']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'data.case_events.destroy': {
    methods: ["DELETE"]
    pattern: '/data/case_events/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/case_events_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/case_events_controller').default['destroy']>>>
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/case_events_controller').default['destroy']>>>
    }
  }
  'search': {
    methods: ["GET","HEAD"]
    pattern: '/search'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/search_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/search_controller').default['index']>>>
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/search_controller').default['index']>>>
    }
  }
}

export namespace Route {
  export type Request<Name extends keyof typeof routes> = RouteWithRegistry.Request<typeof routes, Name>
  export type Response<Name extends keyof typeof routes> = RouteWithRegistry.Response<typeof routes, Name>
  export type Params<Name extends keyof typeof routes> = RouteWithRegistry.Params<typeof routes, Name>
  export type Body<Name extends keyof typeof routes> = RouteWithRegistry.Body<typeof routes, Name>
  export type Query<Name extends keyof typeof routes> = RouteWithRegistry.Query<typeof routes, Name>
  export type Error<Name extends keyof typeof routes> = RouteWithRegistry.Error<typeof routes, Name>
}

export namespace Path {
  export type Request<M extends Method, P extends PatternsByMethod<typeof routes, M>> =
    PathWithRegistry.Request<typeof routes, M, P>
  export type Response<M extends Method, P extends PatternsByMethod<typeof routes, M>> =
    PathWithRegistry.Response<typeof routes, M, P>
  export type Params<M extends Method, P extends PatternsByMethod<typeof routes, M>> =
    PathWithRegistry.Params<typeof routes, M, P>
  export type Body<M extends Method, P extends PatternsByMethod<typeof routes, M>> =
    PathWithRegistry.Body<typeof routes, M, P>
  export type Query<M extends Method, P extends PatternsByMethod<typeof routes, M>> =
    PathWithRegistry.Query<typeof routes, M, P>
  export type Error<M extends Method, P extends PatternsByMethod<typeof routes, M>> =
    PathWithRegistry.Error<typeof routes, M, P>
}
