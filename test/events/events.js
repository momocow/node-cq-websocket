module.exports = [
  'message.private',
  'message.discuss',
  'message.discuss.@.me',
  'message.discuss.@me', // @deprecated
  'message.group',
  'message.group.@.me',
  'message.group.@me', // @deprecated

  'notice.group_upload',
  'notice.group_admin.set',
  'notice.group_admin.unset',
  'notice.group_decrease.leave',
  'notice.group_decrease.kick',
  'notice.group_decrease.kick_me',
  'notice.group_increase.approve',
  'notice.group_increase.invite',
  'notice.friend_add',

  'request.friend',
  'request.group.add',
  'request.group.invite',

  'meta_event.lifecycle',
  'meta_event.heartbeat'
]
