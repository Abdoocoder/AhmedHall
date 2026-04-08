-- Seed rooms
INSERT INTO rooms (name, capacity, description) VALUES
  ('القاعة الكبرى', 500, 'قاعة رئيسية للمؤتمرات والفعاليات الكبيرة'),
  ('قاعة الاجتماعات أ', 50, 'قاعة متوسطة للاجتماعات'),
  ('قاعة الاجتماعات ب', 30, 'قاعة صغيرة للاجتماعات'),
  ('قاعة التدريب', 100, 'قاعة مجهزة للتدريب والورش')
ON CONFLICT DO NOTHING;

-- Seed organizations
INSERT INTO organizations (name, contact_person, phone, email) VALUES
  ('جمعية التنمية الاجتماعية', 'أحمد محمد', '0501234567', 'info@tanmia.org'),
  ('نادي الشباب', 'خالد عبدالله', '0559876543', 'contact@shabab.org'),
  ('مؤسسة التعليم المستمر', 'فاطمة أحمد', '0543216789', 'edu@learning.org')
ON CONFLICT DO NOTHING;
