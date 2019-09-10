import $ from '@lib/ajax.js';

export default {
  getAnnouncementPage: (params) => $.get('/sys/announcement/page', params),
  getAnnouncement: (id) => $.get(`/sys/announcement/${id}`)
};