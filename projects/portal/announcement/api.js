import $ from '@lib/ajax.js';

export default {
  getAnnouncementPage: (params) => $.get('/issue/v1/announcement/page', params),
  getAnnouncement: (id) => $.get(`/issue/v1/announcement/${id}`)
};
